import { Type, defineShape, extendShape, arrayOf } from './../src/ShapeType';
import Shape from './../src/Shape';

describe('ShapeType', () => {
	const UserShape = defineShape({
		id     : Type.number(),
		ownerID: Type.number().or(Type.null()),
		name   : Type.string(),
		type   : Type.string()
	});

	it ('defines a shape successfully', () => {
		expect(UserShape instanceof Shape).toEqual(true);
	});

	it ('extends a shape successfully', () => {
		const EnhancedUserShape = extendShape(UserShape, { isDog: Type.bool() });
		const isShape = EnhancedUserShape instanceof Shape;
		const fields = [ 'id', 'ownerID', 'name', 'type', 'isDog' ];
		const hasFields = JSON.stringify(Object.keys(EnhancedUserShape.shape)) === JSON.stringify(fields);
		expect(isShape && hasFields).toEqual(true);
	});

});
