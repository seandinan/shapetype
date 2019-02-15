class ArrayContainer {
	constructor(type){
		this.type = type;
		this.isOptional = false;
	}

	compare = (val) => {
		if (!val.reduce) return false;
		return val.reduce((isMatch, b) => {
			if (!isMatch) return isMatch;
			return this.type.compare(b);
		}, true)
	};

	partialCompare = (val) => {
		if (!val.reduce) return false;
		return val.reduce((isOK, b) => {
			return isOK ?  this.type.partialCompare(b) : isOK;
		}, true);
	};

	validate = (val) => {
		let results = [];
		if (!val.forEach) throw TypeError('ArrayContainer requires an array for comparison');
		val.forEach((entry, i) => {
			const { missingFields, extraFields, invalidTypeFields } = this.type.validate(entry);
			if (missingFields.length > 0 || extraFields.length > 0 || invalidTypeFields.length > 0){
				results.push({ index: i,  missingFields, extraFields, invalidTypeFields });
			}
		});
		return results;
	};

	partialValidate = (val) => {
		let results = [];
		if (!val.forEach) throw TypeError('ArrayContainer requires an array for comparison');
		val.forEach((entry, i) => {
			const {
				missingFields,
	      extraFields,
	      invalidTypeFields
			} = this.type.partialValidate(entry);
			if (missingFields.length > 0 || extraFields.length > 0 || invalidTypeFields.length > 0){
				results.push({ index: i,  missingFields, extraFields, invalidTypeFields });
			}
		});
		return results;
	};

	optional = () => {
		this.isOptional = true;
		return this;
	};

}

export default ArrayContainer;
