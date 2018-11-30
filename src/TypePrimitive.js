class TypePrimitive {
	constructor(val, isType){
		this.value = val;
		this.typeChecks = [ isType ];
	}

	compare = (val) => (
		this.typeChecks.reduce((result, check) => {
			if (result) return result;
			return check(val);
		}, false)
	);

	validate = (val) => {
		return this.compare(val) ? [] : [ val ];
	};

	or = (type) => {
		if (!(type instanceof TypePrimitive)) throw 'method "or" requires type TypePrimitive';
		this.typeChecks = [ ...this.typeChecks, ...type.typeChecks ];
		return this;
	};

}

export default TypePrimitive;
