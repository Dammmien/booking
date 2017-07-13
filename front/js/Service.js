class Service {

  constructor(user, router) {
    this.user = user;
  }

  interceptor(resp) {
    if (resp.status === 403) {
      window.location.hash = '/login';
      throw new Error('not logged');
    } else {
      return resp.json();
    }
  }

  getOptions(options) {
    options = options || {};
    options.method = options.method || 'GET';

    options.headers = options.headers || new Headers();
    options.headers.append('Authorization', `Bearer ${this.user.token}`);

    if (options.method === 'POST') {
      options.headers.append('Content-Type', 'application/json');
      options.headers.append('Accept', 'application/json');
    }

    return options;
  }

  fetchBookables(company_id) {
    fetch(`http://localhost:9000/companies/${company_id}/bookables`, this.getOptions()).then(this.interceptor).then(
      data => store.set('bookables', data)
    );
  }

  fetchBookings(company_id, bookable_id, start, end) {
    let url = new URL(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings`);
    url.searchParams.append("start", start);
    url.searchParams.append("end", end);

    fetch(url, this.getOptions()).then(this.interceptor).then(
      data => store.set('bookings', data)
    );
  }

  bookSlot(company_id, bookable_id, slot) {
    return fetch(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings`, this.getOptions({
      method: 'POST',
      body: JSON.stringify(slot)
    })).then(this.interceptor);
  }

  unbookSlot(company_id, bookable_id, slot_d) {
    return fetch(`http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings/${slot_d}`, this.getOptions({
      method: 'DELETE'
    })).then(this.interceptor)
  }

}
