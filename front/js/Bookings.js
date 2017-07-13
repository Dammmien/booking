class Bookings extends Inferno.Component {

	constructor(props) {
		super(props);

		this.state = {
			bookings: store.subscribe("bookings", this),
			start: moment().startOf('week'),
			end: moment().endOf('week')
		};

		service.fetchBookings(this.props.company_id, this.props.bookable_id, this.state.start.unix(), this.state.end.unix());
	}

	bookSlot(slot) {
		if (slot.booking) {
			service.unbookSlot(this.props.company_id, this.props.bookable_id, slot.booking._id).then((resp) => {
				store.set('bookings', this.state.bookings.filter(booking => booking._id !== slot.booking._id));
			});
		} else {
			slot.bookable = this.props.bookable_id;
			slot.start = slot.start.unix();
			slot.end = slot.end.unix();
			delete slot.booked;
			delete slot.selected;

			service.bookSlot(this.props.company_id, this.props.bookable_id, slot).then((resp) => {
				slot = Object.assign(slot, resp);
				store.set('bookings', [...this.state.bookings, slot]);
			});
		}
	}

	onWeekChange(verb) {
		this.setState({
			start: this.state.start[verb](1, 'week'),
			end: this.state.end[verb](1, 'week')
		})

		service.fetchBookings(this.props.company_id, this.props.bookable_id, this.state.start.unix(), this.state.end.unix());
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view bookings', [
			Inferno.createVNode(4, Header),

			Inferno.createVNode(2, 'main', null, [
				Inferno.createVNode(2, 'section', null, [
					Inferno.createVNode(2, 'span', null, "Prev", {
						onClick: Inferno.linkEvent('subtract', this.onWeekChange.bind(this))
					}),
					Inferno.createVNode(2, 'span', null, "Next", {
						onClick: Inferno.linkEvent('add', this.onWeekChange.bind(this))
					})
				]),

				Inferno.createVNode(4, Scheduler, null, null, {
					startHour: 8,
					endHour: 22,
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
