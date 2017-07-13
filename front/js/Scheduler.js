class Scheduler extends Inferno.Component {

	constructor(props) {
		super(props);
		this.build();
	}

	componentWillReceiveProps(newProps) {
		this.props = Object.assign(this.props, newProps);
		this.build();
	}

	// $scope.toggleSelectedSlot = function(slot) {
	// 	slot.selected = !slot.selected;

	// 	if (slot.selected) {
	// 		$scope.selectedSlots.push(slot);
	// 	} else {
	// 		let index = $scope.selectedSlots.indexOf(slot);
	// 		$scope.selectedSlots.splice(index, 1);
	// 	}
	// };

	build() {
		this.slots = [];
		this.minutesPerDay = 24 * 60;
		this.slotsPerDay = this.minutesPerDay / this.props.minutesPerSlot;
		this.selectedSlots = [];
		this.buildSlots();
		this.setBookings();
	}

	buildSlots() {
		for (var dayIndex = 0; dayIndex < 7; dayIndex++) {
			this.slots.push([]);
			for (var slotIndex = 0; slotIndex < this.slotsPerDay; slotIndex++) {
				let days = dayIndex * this.minutesPerDay * 60,
					slots = this.props.minutesPerSlot * slotIndex * 60;

				this.slots[dayIndex][slotIndex] = {
					start: moment.unix(this.props.dateRange.start.unix() + days + slots),
					end: moment.unix(this.props.dateRange.start.unix() + days + slots + this.props.minutesPerSlot * 60)
				};
			}
		}
	}

	setBookings() {
		this.props.bookings.forEach(booking => {
			this.slots.forEach(slots => {
				slots.forEach(slot => {
					if (slot.start.unix() === booking.start && slot.end.unix() === booking.end) {
						slot.booking = booking;
					}
				});
			});
		});
	}

	render() {
		return Inferno.createVNode(2, 'section', 'scheduler', [
			Inferno.createVNode(2, 'div', 'content', [
				this.slots.map(day => Inferno.createVNode(2, 'div', 'column', [

					Inferno.createVNode(2, 'div', 'slot header', [
						Inferno.createVNode(2, 'div', 'slot-content', `${day[0].start.format("ddd")} ${day[0].start.date()} ${day[0].start.format("MMM")}`)
					]),

					day.filter(
						slot => slot.start.get('hour') >= this.props.startHour && slot.start.get('hour') < this.props.endHour
					).map(slot => Inferno.createVNode(2, 'div', slot.booking ? 'slot booked' : 'slot', [
						Inferno.createVNode(
							2,
							'div',
							'slot-content',
							slot.booking ? 'Booked' : `${slot.start.format("HH:mm")} - ${slot.end.format("HH:mm")}`,
							{
								style: `height: ${this.props.minutesPerSlot}px`,
								onClick: Inferno.linkEvent(slot, this.props.onClickSlot)
							}
						)
					]))

				]))
			])
		]);
	}

}
