class Service {

	constructor() {}

	fetchBookable(company_id, bookable_id) {
		fetch(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}`).then(
			resp => resp.json()
		).then(
			data => store.set('bookable', data)
		);
	}

	fetchBookings(company_id, bookable_id, start, end) {
		let url = new URL(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings`);
		url.searchParams.append("start", start);
		url.searchParams.append("end", end);

		fetch(url).then(
			resp => resp.json()
		).then(
			data => store.set('bookings', data)
		);
	}

	bookSlot(company_id, bookable_id, slot, token) {
		return fetch(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings`, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}),
			body: JSON.stringify( { slot, token, bookable_id })
		}).then(response => response.json());
	}

}
