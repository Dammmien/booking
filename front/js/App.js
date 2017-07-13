class App extends Inferno.Component {

	constructor(props) {
		super(props);

		this.router = new Router({
			'Home': '#/',
			'Login': '#/login',
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
			'Login': Inferno.createVNode(4, Login, null, null, this.state.currentRoute.data),
			'Bookables': Inferno.createVNode(4, Bookables, null, null, this.state.currentRoute.data),
			'Bookings': Inferno.createVNode(4, Bookings, null, null, this.state.currentRoute.data),
		}[this.state.currentRoute.name] || Inferno.createVNode(2, 'span', null, '404');
	}

	render() {
		console.log( this.getTemplate() );
		return this.getTemplate();
	}

}
