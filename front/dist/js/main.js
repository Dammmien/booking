class App extends Inferno.Component {

	constructor() {
		super();

		this.router = new Router({
			'Home': '#/',
			'Bookables': '#/company/:company_id/bookables',
			'Bookings': '#/company/:company_id/bookables/:bookable_id/bookings'
		});

		this.router.subscribe(this.onRouteChange.bind(this));

		this.state = {
			currentRoute: this.router.currentRoute
		};
	}

	onRouteChange(oldRoute, newRoute) {
		this.setState({
			currentRoute: newRoute
		})
	}

	getTemplate() {
		return {
			'Home': Inferno.createVNode(4, Home, null, null, this.state.currentRoute.data),
			'Bookables': Inferno.createVNode(4, Bookables, null, null, this.state.currentRoute.data),
			'Bookings': Inferno.createVNode(4, Bookings, null, null, this.state.currentRoute.data),
		}[this.state.currentRoute.name] || Inferno.createVNode(2, 'span', null, '404');
	}

	render() {
		return this.getTemplate();
	}

}

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

class Bookings extends Inferno.Component {

	constructor(props) {
		super(props);

		this.state = {
			bookings: store.subscribe("bookings", this)
		};

		service.fetchBookings(this.props.company_id, this.props.bookable_id);
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view bookings', [
			Inferno.createVNode(4, Header),

			Inferno.createVNode(2, 'main', null, [
				Inferno.createVNode(4, Scheduler, null, null, this.state.bookings)
			])
		]);
	}

}

class Header extends Inferno.Component {

	constructor() {
		super();
	}

	componentDidMount() {
	}

	render() {
		return Inferno.createVNode( 2, 'header', null, [
			Inferno.createVNode( 2, 'div', null, 'Header'),
			Inferno.createVNode( 2, 'a', null, 'Home', {href: "/#"}),
			Inferno.createVNode( 2, 'a', null, 'Bookables', {href: "/#/company/58e3c40d4553262988a05034/bookables"})
		] );
	}

}

class Home extends Inferno.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view home', [
			Inferno.createVNode(4, Header),
			Inferno.createVNode(2, 'main', null, null )
		]);
	}

}

class Router {

	constructor(routes) {
		this.routes = [];
		this.history = [];
		this.subscriptions = [];
		this.lastRoute = null;
		this.currentRoute = null;
		for (let name in routes) this.addRoute(name, routes[name]);
		this.setCurrentRoute();
		window.addEventListener("hashchange", () => this.onRouteChange(), false);
	}

	setCurrentRoute() {
		const matchingRoute = this.findMatchingRoute(window.location.hash);
		this.currentRoute = matchingRoute ? matchingRoute : this.findMatchingRoute('#/');
		this.subscriptions.forEach( fn => fn(this.lastRoute, this.currentRoute) );
	}

	getParams() {
		return location.search.substr(1).split("&").reduce((out, part) => {
			const [key, value] = part.split("=");
			out[key] = decodeURIComponent(value);
			return out;
		}, {});
	}

	onRouteChange() {
		this.lastRoute = this.currentRoute;
		this.history.push(this.lastRoute);
		this.setCurrentRoute();
	}

	findMatchingRoute(hash) {
		return this.routes.reduce((output, route) => {
			const match = hash.match(route.regex);
			return match ? this.getMatchingRouteObject(match, route) : output;
		}, null);
	}

	getMatchingRouteObject(match, route) {
		return Object.assign({
			data: this.getMatchingRouteData(match, route),
			params: this.getParams()
		}, route);
	}

	getMatchingRouteData(match, route) {
		let data = {};
		for (var key in route.keys) data[key] = match[route.keys[key]];
		return data;
	}

	getRouteKeys(schema) {
		return schema.split('/').reduce((p, c, i, a) => {
			const match = c.match(/:(\w*)/);
			if (match) p[match[1]] = Object.keys(p).length + 1;
			return p;
		}, {});
	}

	addRoute(name, schema) {
		this.routes.push({
			name: name,
			schema: schema,
			keys: this.getRouteKeys(schema),
			regex: `^${schema.split('/').map(x => x.replace(/:(\w*)/g, '(\\w*)')).join('\\/')}$`
		});
	}

	subscribe(fn) {
		this.subscriptions.push(fn);
	}

}

class Scheduler extends Inferno.Component {

	constructor(props) {
		super(props);
		console.log( this.props );

		this.slots = [];
		this.minutesPerDay = 24 * 60;
		this.minutesPerSlot = 60;
		this.slotsPerDay = this.minutesPerDay / this.minutesPerSlot;
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
		this.selectedSlots = [];
		this.buildSlots();
		// this.setBookedSlots();
	}

	buildSlots() {
		for (var dayIndex = 0; dayIndex < 7; dayIndex++) {
			this.slots.push([]);
			for (var slotIndex = 0; slotIndex < this.slotsPerDay; slotIndex++) {
				let days = dayIndex * this.minutesPerDay * 60,
					slots = this.minutesPerSlot * slotIndex * 60;

				this.slots[dayIndex][slotIndex] = {
					selected: false,
					booked: false
					// start: moment.unix(this.dateRange.start.unix() + days + slots),
					// end: moment.unix(this.dateRange.start.unix() + days + slots + this.minutesPerSlot * 60)
				};
			}
		}
	}

	// $scope.setBookedSlots = function() {
	//     $scope.bookedSlots.forEach( function( bookedSlot ) {
	//         $scope.slots.forEach( function( slots ) {
	//             slots.forEach( function( slot ) {
	//                 if ( slot.start.unix() === bookedSlot.start && slot.end.unix() === bookedSlot.end ) {
	//                     slot.booked = true;
	//                 }
	//             } );
	//         } );
	//     } );
	// };

	render() {
		return Inferno.createVNode(2, 'section', 'scheduler', [
			Inferno.createVNode(2, 'div', 'content', [
				this.slots.map(day => Inferno.createVNode(2, 'div', 'column', [

					Inferno.createVNode(2, 'div', 'slot header', [
						Inferno.createVNode(2, 'div', 'slot-content', 'Lun.' )
					]),

					day.map( slot => this.slots.map(day => Inferno.createVNode(2, 'div', 'slot', [
						Inferno.createVNode(2, 'div', 'slot-content', 'HH:mm' )
					])))

				]))
			])
		]);
	}

}

class Service {

	constructor() {}

	fetchBookables(company_id) {
		fetch( `http://localhost:9000/companies/${company_id}/bookables` ).then(
			resp => resp.json()
		).then(
			data => store.set( 'bookables', data)
		);
	}

	fetchBookings(company_id, bookable_id) {
		fetch( `http://localhost:9000/companies/${company_id}/bookables/${bookable_id}/bookings` ).then(
			resp => resp.json()
		).then(
			data => store.set( 'bookings', data)
		);
	}

}

class Store {

	constructor( options ) {
		this.subscriptions = {};
		this._store = options;
	}

	updateComponent( key, component ) {
		let newState = component.state;
		newState[ key ] = this._store[ key ];
		component.setState( newState );
	}

	set( key, value ) {
		this._store[ key ] = value;

		if ( this.subscriptions[ key ] ) {
			this.subscriptions[ key ].forEach( component => this.updateComponent( key, component ) );
		}
	}

	subscribe( key, component ) {
		this.subscriptions[ key ] = this.subscriptions[ key ] || [];
		this.subscriptions[ key ].push( component );
		return this._store[ key ];
	}

}
