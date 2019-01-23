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
		if (!(type instanceof TypePrimitive)) throw 'method "or" requires type TypePrimitive';
		this.typeChecks = [ ...this.typeChecks, ...type.typeChecks ];
		return this;
	};

	optional = () => {
		this.isOptional = true;
		return this;
	};

}

export default TypePrimitive;
