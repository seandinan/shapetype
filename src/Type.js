import {
	BOOL,
	NUMBER,
	STRING,
	OBJECT,
	ARRAY,
	DATETIME,
	NULL,
	UNDEFINED,
	CUSTOM,
	VALUE,
} from './constants';
import TypePrimitive from './TypePrimitive';

const Type = {
	bool      : () => new TypePrimitive(BOOL     , (val) => typeof val === 'boolean'),
	number    : () => new TypePrimitive(NUMBER   , (val) => typeof val === 'number'),
	string    : () => new TypePrimitive(STRING   , (val) => typeof val === 'string'),
	object    : () => new TypePrimitive(OBJECT   , (val) => val && val.constructor.name === 'Object'),
	array     : () => new TypePrimitive(ARRAY    , (val) => val && val.constructor.name === 'Array'),
	datetime  : () => new TypePrimitive(DATETIME , (val) => val && val.constructor.name === 'Date'),
	null      : () => new TypePrimitive(NULL     , (val) => val === null),
	undefined : () => new TypePrimitive(UNDEFINED, (val) => val === undefined),
	value     : function(){
		const values = [...arguments];
		return new TypePrimitive(VALUE, (val) => values.includes(val));
	},
	custom   : (isType, name = CUSTOM) => new TypePrimitive(name, isType),
};

export default Type;
