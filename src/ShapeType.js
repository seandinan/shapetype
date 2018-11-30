import ArrayContainer from './ArrayContainer';
import Shape from './Shape';
import Type from './Type';

export { Type };

export function defineShape(shape){
	return new Shape(shape);
}

export function extendShape(shape, data){
	return new Shape({ ...shape.shape, ...data });
}

export function arrayOf(val){
	return new ArrayContainer(val);
}
