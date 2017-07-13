module.exports = class Bookable {

	constructor(options){
		Object.assign(this, options);
		console.log( this );
	}

}
