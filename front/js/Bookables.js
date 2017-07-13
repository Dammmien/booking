class Bookables extends Inferno.Component {

	constructor(props) {
		super(props);

		this.state = {
			bookables: store.subscribe("bookables", this)
		};

		service.fetchBookables(this.props.company_id);
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view bookables', [
			Inferno.createVNode(4, Header),

			Inferno.createVNode(2, 'main', null, [
				Inferno.createVNode(2, 'ul', null, this.state.bookables.map(bookable => Inferno.createVNode(2, 'li', null, [
					Inferno.createVNode(2, 'a', null, bookable.name, {
						href: `/#/company/${this.props.company_id}/bookables/${bookable._id}/bookings`
					})
				])))
			])
		]);
	}

}
