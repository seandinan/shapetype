import ArrayContainer from './ArrayContainer';
import Shape from './Shape';
import Type from './Type';
import TypePrimitive from './TypePrimitive';

export function defineShape(shape){
	return new Shape(shape);
}

export function extendShape(shape, data){
	return new Shape({ ...shape.shape, ...data });
}

export function arrayOf(val){
	return new ArrayContainer(val);
}

export function optional(shapeOrTypeOrArrayContainer){
	const is = (primitive) => shapeOrTypeOrArrayContainer instanceof primitive;
	if (is(TypePrimitive) || is(ArrayContainer)) return shapeOrTypeOrArrayContainer.optional();
	else if (is(Shape)) return extendShape(shapeOrTypeOrArrayContainer).optional();
	else throw Error('optional() requires a Shape, Type, or ArrayContainer');
}

export { Type };
