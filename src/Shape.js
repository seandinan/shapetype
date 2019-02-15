import ArrayContainer from './ArrayContainer';
import TypePrimitive from './TypePrimitive';

class Shape {
	constructor(shape){
		this.shape = shape;
		this.isOptional = false;
	}

	compare = (obj) => compare(this.shape, obj);

	partialCompare = (obj) => compare(getPartialShape(this.shape, obj), obj);

	validate = (obj) => validate(this.shape, obj);

	partialValidate = (obj) => validate(getPartialShape(this.shape, obj), obj);

	optional = () => {
		this.isOptional = true;
		return this;
	};

}

function getPartialShape(shape, obj){
	const objectKeys = Object.keys(obj);
	const shapeKeys = Object.keys(shape);
	let refShape = { ...shape }; // shallow clone
	shapeKeys.forEach(key => {
		if (!objectKeys.includes(key)) delete refShape[key];
	});
	return refShape;
}

function compare(refShape, obj){
	const objectKeys = Object.keys(obj);
	const shapeKeys = Object.keys(refShape);

	const isNoExtraFields = objectKeys.reduce((isOK, key) => (
		isOK ? shapeKeys.includes(key) : isOK
	), true);

	const isAllRequiredFieldsPresent = shapeKeys.reduce((isOK, key) => {
		if (!isOK) return isOK;
		// Confirm that every non-optional field in this.shape is in obj
		return refShape[key].isOptional || objectKeys.includes(key);
	}, true);

	if (!isNoExtraFields || !isAllRequiredFieldsPresent) return false;

	const isAllFieldsCorrectType = objectKeys.reduce((isOK, key) => {
		if (!isOK) return isOK;
		const is = (instance) => refShape[key] instanceof instance;
		const isShapeOrType = is(TypePrimitive) || is(Shape) || is(ArrayContainer);
		if (isShapeOrType || refShape[key].constructor.name === 'Object'){
			return refShape[key].compare(obj[key]);
		} else return obj[key] === refShape[key];
	}, true);

	return isAllFieldsCorrectType;
}

function validate(refShape, obj){
	const keys = Object.keys(obj);
	let results = {
		missingFields    : [],
		extraFields      : [],
		invalidTypeFields: [],
	};

	// Determine if the value has shapetype methods
	const is = (key) => (instance) => refShape[key] instanceof instance;
	const isShapeOrType = (key) => is(key)(TypePrimitive) || is(key)(Shape) || is(key)(ArrayContainer);

	// Check for keys defined by the Shape but missing from the object
	results.missingFields = Object.keys(refShape).filter(k => {
		const isOptional = refShape[k].isOptional;
		const isMissingFromObject = !keys.includes(k);
		return !isOptional && isMissingFromObject;
	});

	// Validate each key in the object
	keys.forEach(key => {
		// key isn't defined in the Shape
		if (!refShape[key]){
			results.extraFields.push(key);
		} else if (isShapeOrType(key) || refShape[key].constructor.name === 'Object'){
			if (!refShape[key].compare(obj[key])){
				results.invalidTypeFields.push(key);
			};
		} else if (obj[key] !== refShape[key]){
			results.invalidTypeFields.push(key);
		}
	});
	return results;
}

export default Shape;
