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
		console.log( this.currentRoute );
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
