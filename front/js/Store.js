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