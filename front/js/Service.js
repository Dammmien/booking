class Service {

  constructor(user, router) {
    this.user = user;
    this.base_url = 'http://localhost:9000/api/v1';
  }

  interceptor(resp) {
    if (resp.status === 401) {
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
    fetch(`${this.base_url}/public/companies/${company_id}/bookables`, this.getOptions()).then(this.interceptor.bind(this)).then(
      data => store.set('bookables', data)
    );
  }

  fetchBookings(company_id, bookable_id, start, end) {
    let url = new URL(`${this.base_url}/public/companies/${company_id}/bookables/${bookable_id}/bookings`);
    url.searchParams.append("start", start);
    url.searchParams.append("end", end);

    fetch(url, this.getOptions()).then(this.interceptor.bind(this)).then(
      data => store.set('bookings', data)
    );
  }

  bookSlot(company_id, bookable_id, slot) {
    return fetch(`${this.base_url}/public/companies/${company_id}/bookables/${bookable_id}/bookings`, this.getOptions({
      method: 'POST',
      body: JSON.stringify(slot)
    })).then(this.interceptor.bind(this));
  }

  unbookSlot(company_id, bookable_id, slot_d) {
    return fetch(`${this.base_url}/public/companies/${company_id}/bookables/${bookable_id}/bookings/${slot_d}`, this.getOptions({
      method: 'DELETE'
    })).then(this.interceptor.bind(this))
  }

  login(email, password) {
    return fetch(`${this.base_url}/login`, this.getOptions({
      method: 'POST',
      body: JSON.stringify({email, password})
    })).then(res => {
      if (res.status !== 200) throw res;
      return res.json();
    }).then(resp => {
      this.user = resp.user;
      this.user.token = resp.token;
    });
  }
}
