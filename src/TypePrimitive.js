import ArrayContainer from './ArrayContainer';
import Shape from './Shape';

class TypePrimitive {

	constructor(val, isType){
		this.value = val;
		this.typeChecks = [ isType ];
		this.isOptional = false;
	}

	compare = (val) => {
		if (this.isOptional && !val) return true;
		return this.typeChecks.reduce((result, check) => {
			if (result) return result;
			return check(val);
		}, false);
	};

	partialCompare = (val) => this.compare(val);

	validate = (val) => {
		let results = { invalidTypeFields: [] };
		if (this.isOptional && !val) return results;
		if (!this.compare(val)) results.invalidTypeFields.push(val);
		return results;
	};

	partialValidate = (val) => this.validate(val);

	or = (type) => {
		const isType = (refType) => type instanceof refType;
		if (isType(TypePrimitive)){
			this.typeChecks = [ ...this.typeChecks, ...type.typeChecks ];
		} else if (isType(ArrayContainer) || isType(Shape)){
			this.typeChecks = [ ...this.typeChecks, type.compare ];
		} else throw 'Unmethod "or" requires type TypePrimitive, ArrayContainer, or Shape';

		return this;
	};

	optional = () => {
		this.isOptional = true;
		return this;
	};

}

export default TypePrimitive;
