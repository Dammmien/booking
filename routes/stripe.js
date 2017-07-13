const stripePackage = require('stripe');

module.exports = class Stripe {

	constructor(db) {
		this._stripe = stripePackage('sk_test_oeBVStxs2ZT86vTlqtn7z7CA');
	}

	createCharge(source, amount, description) {
		this._stripe.charges.create({
			amount: amount,
			currency: "eur",
			source: source,
			description: description
		}, function(err, charge) {
			console.log( charge );
		});
	}

}
