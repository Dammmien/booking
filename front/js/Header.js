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
