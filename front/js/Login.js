class Login extends Inferno.Component {

	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: ''
		};
	}

	setEmail(value, event) {
		this.setState({ email: event.target.value });
	}

	setPassword(value, event) {
		this.setState({ password: event.target.value });
	}

	submit() {
		service.login(this.state.email, this.state.password).then(
			() => window.location.hash = '/'
		).catch(
			err => console.log( err )
		);
	}

	render() {
		return Inferno.createVNode(2, 'div', 'view login', [
			Inferno.createVNode(4, Header),
			Inferno.createVNode(2, 'main', 'login', [
				Inferno.createVNode(2, 'div', 'form content', [
					Inferno.createVNode(2, 'input', 'content', null, {
						type: 'email',
						placeholder: 'email',
						value: this.state.email,
						onChange: Inferno.linkEvent(null, this.setEmail.bind(this))
					}),
					Inferno.createVNode(2, 'input', 'content', null, {
						type: 'password',
						placeholder: 'password',
						value: this.state.password,
						onChange: Inferno.linkEvent(null, this.setPassword.bind(this))
					}),
					Inferno.createVNode(2, 'button', 'primary', 'Log in', {
						onClick: Inferno.linkEvent(null, this.submit.bind(this))
					}),
					Inferno.createVNode(2, 'button', 'sign-link', [
						Inferno.createVNode(2, 'span', null, 'Not registered ?'),
						Inferno.createVNode(2, 'a', null, 'Sign up now !', {href: '/signin'})
					])
				])
			], {id: 'login'})
		]);
	}

}
