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
