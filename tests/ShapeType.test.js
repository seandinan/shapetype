import { Type, defineShape, extendShape, arrayOf } from './../src/ShapeType';
import Shape from './../src/Shape';

describe('ShapeType', () => {
	const validateTemplate = { missingFields: [], extraFields: [], invalidTypeFields: [] };

	const users = [
		{ id: 1, ownerID: null, name: 'Sean', type: 'person' },
		{ id: 2, ownerID: 1, name: 'Toby', type: 'dog' },
		{ id: 3, ownerID: 1, name: 'KC', type: 'cat' },
	];

	const enhancedUser = { id: 2, ownerID: 1, name: 'Toby', type: 'dog', isDog: true };

	const UserShape = defineShape({
		id     : Type.number(),
		ownerID: Type.number().or(Type.null()),
		name   : Type.string(),
		type   : Type.string()
	});

	const EnhancedUserShape = extendShape(UserShape, {
		isDog: Type.bool()
	});

	const NestedShape = defineShape({
		id       : Type.number(),
		createdBy: UserShape,
	});

	const ShapeWithArray = defineShape({
		id   : Type.number(),
		users: arrayOf(UserShape),
	});

	const DoubleNesting = defineShape({
		id    : Type.number(),
		shapes: arrayOf(NestedShape),
	});

	const OptionalShape = defineShape({
		id  : Type.number(),
		name: Type.string(),
		type: Type.string().optional(),
	});

	it ('defines a shape successfully', () => {
		expect(UserShape instanceof Shape).toEqual(true);
	});

	it ('extends a shape successfully', () => {
		const isShape = EnhancedUserShape instanceof Shape;
		const fields = [ 'id', 'ownerID', 'name', 'type', 'isDog' ];
		const hasFields = JSON.stringify(Object.keys(EnhancedUserShape.shape)) === JSON.stringify(fields);
		expect(isShape && hasFields).toEqual(true);
	});

	it ('nests a shape successfully', () => {
		expect (NestedShape instanceof Shape).toEqual(true);
	});

	it ('compares an array with arrayOf() successfully', () => {
		expect (arrayOf(UserShape).compare(users)).toEqual(true);
	});

	it ('compares a non-array with arrayOf() unsuccessfully', () => {
		expect (arrayOf(UserShape).compare(users[0])).toEqual(false);
	});

	it ('validates an array with arrayOf() successfully', () => {
		expect (arrayOf(UserShape).validate(users)).toEqual([]);
	});

	it ('validates an array containing non-matching Shapes unsuccessfully', () => {
		let badUsers = [ {...users[0]}, {...users[1]} ];
		delete badUsers[0].id;
		badUsers[0].name = 12;
		badUsers[1].whoops = 'oh no';
		const result = [
			{ index: 0, extraFields: [], invalidTypeFields: [ 'name' ], missingFields: [ 'id' ] },
			{ index: 1, extraFields: [ 'whoops' ], invalidTypeFields: [], missingFields: [] },
		];
		expect (arrayOf(UserShape).validate(badUsers)).toEqual(result);
	});

	it ('validates a non-array with arrayOf() unsuccessfully', () => {
		try {
			const badUserTest = arrayOf(UserShape).validate('test');
		} catch(err){
			expect (err.name).toEqual('TypeError');
		}
	});

	it ('compares a matching shape successfully', () => {
		expect (UserShape.compare(users[0])).toEqual(true);
	});

	it ('compares a non-matching shape unsuccessfully', () => {
		expect (UserShape.compare(enhancedUser)).toEqual(false);
	});

	it ('validates a matching shape successfully', () => {
		expect (UserShape.validate(users[0])).toEqual(validateTemplate);
	});

	it ('validates a shape with extra fields unsuccessfully', () => {
		const result = {...validateTemplate, extraFields: [ 'isDog' ]};
		expect (UserShape.validate(enhancedUser)).toEqual(result);
	});

	it ('validates a shape with missing fields unsuccessfully', () => {
		const { id, ...userWithoutID } = users[0];
		const result = {...validateTemplate, missingFields: [ 'id' ]};
		expect (UserShape.validate(userWithoutID)).toEqual(result);
	});

	it ('compares a shape with a matching arrayOf() type successfully', () => {
		const shape = { id: 12, users };
		expect (ShapeWithArray.compare(shape)).toEqual(true);
	});

	it ('compares a shape with a non-matching arrayOf() type unsuccessfully', () => {
		let badShapeWithArray = { id: 12, users: [ {...users[0] }] };
		badShapeWithArray.users[0].name = 12;
		expect (ShapeWithArray.compare(badShapeWithArray)).toEqual(false);
	});

	it ('validates a shape with a matching arrayOf() type successfully', () => {
		const shape = { id: 12, users };
		expect (ShapeWithArray.validate(shape)).toEqual(validateTemplate);
	});

	it ('validates a shape with a non-matching arrayOf() type unsuccessfully', () => {
		let badShapeWithArray = { id: 12, users: [ {...users[0] }] };
		badShapeWithArray.users[0].name = 12;
		const result = {...validateTemplate, invalidTypeFields: [ 'users' ]};
		expect (ShapeWithArray.validate(badShapeWithArray)).toEqual(result);
	});

	it ('compares a matching double-nested shape successfully', () => {
		const doubleNester = {
			id: 12,
			shapes: [ { id: 1, createdBy: users[0] }, { id: 2, createdBy: users[1] } ],
		};
		expect (DoubleNesting.compare(doubleNester)).toEqual(true);
	});

	it ('compares a non-matching double-nested shape unsuccessfully', () => {
		const doubleNester = {
			id: 12,
			shapes: [ { id: 1, createdBy: users[0] }, { id: '2', createdBy: users[1] } ],
		};
		expect (DoubleNesting.compare(doubleNester)).toEqual(false);
	});

	it ('validates a matching double-nested shape successfully', () => {
		const doubleNester = {
			id: 12,
			shapes: [ { id: 1, createdBy: users[0] }, { id: 2, createdBy: users[1] } ],
		};
		expect (DoubleNesting.validate(doubleNester)).toEqual(validateTemplate);
	});

	it ('validates a non-matching double-nested shape unsuccessfully', () => {
		const doubleNester = {
			id: 12,
			shapes: [ { id: 1, createdBy: users[0] }, { id: '2', createdBy: users[1] } ],
		};
		const result = { extraFields: [], invalidTypeFields: [ 'shapes' ], missingFields: [] };
		expect (DoubleNesting.validate(doubleNester)).toEqual(result);
	});

	it ('compares a present optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
			type: 'Dog',
		};
		expect (OptionalShape.compare(testShape)).toEqual(true);
	});

	it ('validates a present optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
			type: 'Dog',
		};
		expect (OptionalShape.validate(testShape)).toEqual(validateTemplate);
	});

	it ('compares a missing optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
		};
		expect (OptionalShape.compare(testShape)).toEqual(true);
	});

	it ('validates a missing optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
		};
		expect (OptionalShape.validate(testShape)).toEqual(validateTemplate);
	});

	it ('compares an invalid optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
			type: 1,
		};
		expect (OptionalShape.compare(testShape)).toEqual(false);
	});

	it ('validates an invalid optional field successfully', () => {
		const testShape = {
			id: 12,
			name: 'Toby',
			type: 1,
		};
		const result =  { extraFields: [], invalidTypeFields: [ 'type' ], missingFields: [] };
		expect (OptionalShape.validate(testShape)).toEqual(result);
	});

});
