class Bookings extends Inferno.Component {

	constructor(props) {
		super(props);

		this.state = {
			bookable: store.subscribe("bookable", this),
			bookings: store.subscribe("bookings", this),
			start: moment().startOf('week'),
			end: moment().endOf('week')
		};

		service.fetchBookings(this.props.company_id, this.props.bookable_id, this.state.start.unix(), this.state.end.unix());
		service.fetchBookable(this.props.company_id, this.props.bookable_id);
	}

	bookSlot(slot) {
		this.stripeCheckout = StripeCheckout.configure({
			key: 'pk_test_V2LnY7xXFYMEfNAnI05fpqxb',
			image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
			locale: 'auto',
			token: token => {
				slot.start = slot.start.unix();
				slot.end = slot.end.unix();
				delete slot.booked;
				delete slot.bookings;
				delete slot.selected;

				service.bookSlot(this.props.company_id, this.props.bookable_id, slot, token).then((resp) => {
					slot = Object.assign(slot, resp);
					store.set('bookings', [...this.state.bookings, slot]);
				});
			}
		});

		// Close Checkout on page navigation:
		window.addEventListener('popstate', function() {
			this.stripeCheckout.close();
		});

		this.stripeCheckout.open({
			name: 'Réservation',
			description: 'Description',
			zipCode: true,
			currency: 'eur',
			amount: this.state.bookable.price
		});
	}

	onWeekChange(verb) {
		this.changeDate(this.state.start[verb](1, 'week'), this.state.end[verb](1, 'week'));
	}

	onDayChange(x, event) {
		this.changeDate(moment(event.target.value).subtract(3, 'day'), moment(event.target.value).add(3, 'day'));
	}

	changeDate(start, end){
		this.setState({
			start: start,
			end: end
		});

		service.fetchBookings(this.props.company_id, this.props.bookable_id, this.state.start.unix(), this.state.end.unix());
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view bookings', [

			Inferno.createVNode(2, 'main', null, [
				Inferno.createVNode(2, 'section', 'date', [
					Inferno.createVNode(2, 'span', null, "Prev", {
						onClick: Inferno.linkEvent('subtract', this.onWeekChange.bind(this))
					}),
					Inferno.createVNode(2, 'input', null, null, {
						type: 'date',
						onChange: Inferno.linkEvent('subtract', this.onDayChange.bind(this))
					}),
					Inferno.createVNode(2, 'span', null, "Next", {
						onClick: Inferno.linkEvent('add', this.onWeekChange.bind(this))
					})
				]),

				Inferno.createVNode(4, Scheduler, null, null, {
					startHour: 8,
					endHour: 22,
					quota: this.state.bookable.slot_quota,
					dateRange: {
						start: this.state.start,
						end: this.state.end
					},
					minutesPerSlot: 60,
					bookings: this.state.bookings,
					onClickSlot: this.bookSlot.bind(this)
				})
			])
		]);
	}

}
