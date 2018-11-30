import ArrayContainer from './ArrayContainer';
import TypePrimitive from './TypePrimitive';

class Shape {
	constructor(shape){
		this.shape = shape;
	}

	compare = (obj) => {
		return Object.keys(obj).reduce((isMatch, key) => {
			if (!isMatch) return isMatch; // Already been shown to be false
			if (!this.shape[key]) return false; // Key missing from reference shape
			const is = (instance) => this.shape[key] instanceof instance;
			const isShapeOrType = is(TypePrimitive) || is(Shape) || is(ArrayContainer);
			if (isShapeOrType || this.shape[key].constructor.name === 'Object'){
				return this.shape[key].compare(obj[key]);
			} else return obj[key] === this.shape[key];
		}, true)
	}

	validate = (obj) => {
		let results = [];
		const is = (instance) => (key) => this.shape[key] instanceof instance;
		const isShapeOrType = is(TypePrimitive) || is(Shape) || is(ArrayContainer);
		Object.keys(obj).forEach(key => {
			if (!this.shape[key]){
				results.push(key);
			} else if (isShapeOrType(key) || this.shape[key].constructor.name === 'Object'){
				if (!this.shape[key].compare(obj[key])){
					results.push(key);
				};
			} else if (obj[key] !== this.shape[key]){
				results.push(key);
			}
		});
		return results;
	}
}

export default Shape;
