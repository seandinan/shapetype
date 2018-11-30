class ArrayContainer {
	constructor(type){
		this.type = type;
	}

	compare = (val) => (
		val.reduce((isMatch, b) => {
			if (!isMatch) return isMatch;
			return this.type.compare(b);
		}, true)
	);

	validate = (val) => {
		let results = [];
		val.forEach((entry, i) => {
			const validationResults = this.type.validate(entry);
			if (results.length > 0){
				results.push({ index: i, data: validationResults });
			}
		})
		return results;
	}
}

export default ArrayContainer;
