import Type from '../src/Type';
import { arrayOf } from './../src/ShapeType';

describe('Type', () => {

	describe('Type.or()', () => {
		const createdAtType = Type.string()
			.or(arrayOf(Type.string()))
			.or(arrayOf(arrayOf(Type.string())))

		it ('chains "or" values', () => {
			const type = Type.number().or(Type.string()).or(Type.null());
			const compareNumber = type.compare(4);
			const compareString = type.compare('dog');
			const compareNull   = type.compare(null);
			expect(compareNumber && compareString && compareNull).toEqual(true);
		});

		it ('compares a value at the start of an "or" chain', () => {
			expect(createdAtType.compare('testval')).toEqual(true);
		});

		it ('compares an arrayOf in an "or" chain', () => {
			expect(createdAtType.compare([ 'test1', 'test2' ])).toEqual(true);
		});

		it ('compares a nested arrayOf in an "or" chain', () => {
			expect(createdAtType.compare([ ['test1'], ['test2'] ])).toEqual(true);
		});
	})

	describe('bool', () => {
		const bool = Type.bool();
		it ('compares a bool successfully', () => {
			expect(bool.compare(true)).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(bool.compare('test')).toEqual(false);
		});

		it ('validates a bool successfully', () => {
			expect(bool.validate(false)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates a string unsuccessfully', () => {
			expect(bool.validate('test')).toEqual({ invalidTypeFields: [ 'test' ] });
		});
	});

	describe('number', () => {
		const number = Type.number();
		it ('compares a number successfully', () => {
			expect(number.compare(12)).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(number.compare('test')).toEqual(false);
		});

		it ('validates a number successfully', () => {
			expect(number.validate(12)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates a string unsuccessfully', () => {
			expect(number.validate('test')).toEqual({ invalidTypeFields: [ 'test' ] });
		});
	});

	describe('string', () => {
		const string = Type.string();
		it ('compares a string successfully', () => {
			expect(string.compare('test')).toEqual(true);
		});

		it ('compares a number unsuccessfully', () => {
			expect(string.compare(12)).toEqual(false);
		});

		it ('validates a string successfully', () => {
			expect(string.validate('test')).toEqual({ invalidTypeFields: [] });
		});

		it ('validates a number unsuccessfully', () => {
			expect(string.validate(12)).toEqual({ invalidTypeFields: [ 12 ] });
		});
	});

	describe('object', () => {
		const object = Type.object();
		it ('compares an object successfully', () => {
			expect(object.compare({ dog: 'Toby' })).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(object.compare('test')).toEqual(false);
		});

		it ('validates an object successfully', () => {
			expect(object.validate({ dog: 'Toby' })).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an array unsuccessfully', () => {
			expect(object.validate([ 'test' ])).toEqual({ invalidTypeFields: [ [ 'test' ] ] });
		});
	});

	describe('array', () => {
		const array = Type.array();
		it ('compares an array successfully', () => {
			expect(array.compare(['test1', 'test2'])).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(array.compare('test')).toEqual(false);
		});

		it ('validates an array successfully', () => {
			expect(array.validate(['test'])).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an object unsuccessfully', () => {
			expect(array.validate({ dog: 'Toby' }))
				.toEqual({ invalidTypeFields: [ { dog: 'Toby' } ] });
		});
	});

	describe('datetime', () => {
		const datetime = Type.datetime();
		const testdate = new Date();
		it ('compares a datetime successfully', () => {
			expect(datetime.compare(testdate)).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(datetime.compare('test')).toEqual(false);
		});

		it ('validates a datetime successfully', () => {
			expect(datetime.validate(testdate)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an object unsuccessfully', () => {
			expect(datetime.validate({ dog: 'Toby' }))
				.toEqual({ invalidTypeFields: [ { dog: 'Toby' } ] });
		});
	});

	describe('null', () => {
		const nullType = Type.null();
		it ('compares a null value successfully', () => {
			expect(nullType.compare(null)).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(nullType.compare('test')).toEqual(false);
		});

		it ('validates a null value successfully', () => {
			expect(nullType.validate(null)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an object unsuccessfully', () => {
			expect(nullType.validate({ dog: 'Toby' }))
				.toEqual({ invalidTypeFields: [ { dog: 'Toby' } ] });
		});
	});

	describe('undefined', () => {
		const undefinedType = Type.undefined();
		it ('compares an undefined value successfully', () => {
			expect(undefinedType.compare(undefined)).toEqual(true);
		});

		it ('compares a string unsuccessfully', () => {
			expect(undefinedType.compare('test')).toEqual(false);
		});

		it ('validates an undefined value successfully', () => {
			expect(undefinedType.validate(undefined)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an object unsuccessfully', () => {
			expect(undefinedType.validate({ dog: 'Toby' }))
				.toEqual({ invalidTypeFields: [ { dog: 'Toby' } ] });
		});
	});

	describe('value', () => {
		const values = Type.value(1, 2, 3, 'dog');
		it ('compares an included number value successfully', () => {
			expect(values.compare(1)).toEqual(true);
		});

		it ('compares an included string value successfully', () => {
			expect(values.compare('dog')).toEqual(true);
		});

		it ('compares an unincluded value unsuccessfully', () => {
			expect(values.compare(12)).toEqual(false);
		});

		it ('validates an included value successfully', () => {
			expect(values.validate('dog')).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an unincluded value unsuccessfully', () => {
			expect(values.validate(12)).toEqual({ invalidTypeFields: [ 12 ] });
		});
	});

	describe('custom', () => {
		const goodEmail = 'test@test.com';
		const badEmail = 'test@fail'
		const emailType = Type.custom((val) => {
			// Courtesy of regexr.com/2rhq7
			return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(val);
		});

		it ('compares a matching value successfully', () => {
			expect(emailType.compare(goodEmail)).toEqual(true);
		});

		it ('compares a non-matching value unsuccessfully', () => {
			expect(emailType.compare(badEmail)).toEqual(false);
		});

		it ('validates a matching value successfully', () => {
			expect(emailType.validate(goodEmail)).toEqual({ invalidTypeFields: [] });
		});

		it ('validates an non-matching value unsuccessfully', () => {
			expect(emailType.validate(badEmail)).toEqual({ invalidTypeFields: [ badEmail ] });
		});
	});

})
