import ArrayContainer from './ArrayContainer';
import TypePrimitive from './TypePrimitive';

class Shape {
	constructor(shape){
		this.shape = shape;
	}

	compare = (obj) => {
		// All fields are of correct type
			// Confirm that every obj[key] passes a .compare test with this.shape[key]
		const objectKeys = Object.keys(obj);
		const shapeKeys = Object.keys(this.shape);

		const isNoExtraFields = objectKeys.reduce((isOK, key) => (
			isOK ? shapeKeys.includes(key) : isOK
		), true);

		const isAllRequiredFieldsPresent = shapeKeys.reduce((isOK, key) => {
			if (!isOK) return isOK;
			// Confirm that every non-optional field in this.shape is in obj
			return this.shape[key].isOptional || objectKeys.includes(key);
		}, true);

		if (!isNoExtraFields || !isAllRequiredFieldsPresent) return false;

		const isAllFieldsCorrectType = objectKeys.reduce((isOK, key) => {
			if (!isOK) return isOK;
			const is = (instance) => this.shape[key] instanceof instance;
			const isShapeOrType = is(TypePrimitive) || is(Shape) || is(ArrayContainer);
			if (isShapeOrType || this.shape[key].constructor.name === 'Object'){
				return this.shape[key].compare(obj[key]);
			} else return obj[key] === this.shape[key];
		}, true);

		return isAllFieldsCorrectType;
	}

	validate = (obj) => {
		const keys = Object.keys(obj);

		let results = {
			missingFields    : [],
			extraFields      : [],
			invalidTypeFields: [],
		};

		// Determine if the value has shapetype methods
		const is = (key) => (instance) => this.shape[key] instanceof instance;
		const isShapeOrType = (key) => is(key)(TypePrimitive) || is(key)(Shape) || is(key)(ArrayContainer);

		// Check for keys defined by the Shape but missing from the object
		results.missingFields = Object.keys(this.shape).filter(k => {
			const isOptional = this.shape[k].isOptional;
			const isMissingFromObject = !keys.includes(k);
			return !isOptional && isMissingFromObject;
		});

		// Validate each key in the object
		keys.forEach(key => {
			// key isn't defined in the Shape
			if (!this.shape[key]){
				results.extraFields.push(key);
			} else if (isShapeOrType(key) || this.shape[key].constructor.name === 'Object'){
				if (!this.shape[key].compare(obj[key])){
					results.invalidTypeFields.push(key);
				};
			} else if (obj[key] !== this.shape[key]){
				results.invalidTypeFields.push(key);
			}
		});
		return results;
	}
}

export default Shape;
