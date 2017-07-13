const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

const BookingRoute = require('./routes/booking');
const BookableRoute = require('./routes/bookable');
const CompanyRoute = require('./routes/company');

module.exports = class Server {

    constructor(options) {
        this.options = options;
        this.initExpress();
        this.bookingRoute = new BookingRoute(this.options.db);
        this.bookableRoute = new BookableRoute(this.options.db);
        this.companyRoute = new CompanyRoute(this.options.db);
        this.setRoutes();
    }

    initExpress() {
        this.server = express();
        this.server.use(bodyParser.json());
        this.server.use(express.static(__dirname + '/front'));
        this.server.set('secret', 'config-secret-key-to-change');

        console.log(jwt.sign({ email: 'd.damien@live.fr'}, this.server.get('secret')));
    }

    setRoutes() {
        const BOOKABLES_URL = '/companies/:company_id/bookables';
        const BOOKINGS_URL = `${BOOKABLES_URL}/:bookable_id/bookings`;

        // Add CORS headers
        this.server.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.server.use((req, res, next) => {
            const tokenRegex = /(\S*)\s(\S*)/g;
            const tokenMatch = tokenRegex.exec(req.headers['authorization']);

            if (tokenMatch) {
                console.log( tokenMatch[2] );
                jwt.verify(tokenMatch[2], this.server.get('secret'), (err, decoded) => {
                    if (err) {
                        console.log( err );
                        return res.status(403).send({
                            success: false,
                            message: 'Impossible to decode token'
                        });
                    } else {
                        next();
                    }
                });

            } else {
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
        });

        this.server.get('/', function(req, res) {
            res.sendFile(__dirname + '/front/index.html');
        });

        // COMPANIES
        this.server.get('/companies/:company_id', this.companyRoute.read.bind(this.companyRoute));
        this.server.delete('/companies/:company_id', this.companyRoute.delete.bind(this.companyRoute));
        this.server.put('/companies', this.companyRoute.update.bind(this.companyRoute));
        this.server.post('/companies', this.companyRoute.create.bind(this.companyRoute));

        // BOOKABLES
        this.server.get(`${BOOKABLES_URL}/:bookable_id`, this.bookableRoute.read.bind(this.bookableRoute));
        this.server.delete(`${BOOKABLES_URL}/:bookable_id`, this.bookableRoute.delete.bind(this.bookableRoute));
        this.server.put(BOOKABLES_URL, this.bookableRoute.update.bind(this.bookableRoute));
        this.server.post(BOOKABLES_URL, this.bookableRoute.create.bind(this.bookableRoute));
        this.server.get(BOOKABLES_URL, this.bookableRoute.getFromCompanyId.bind(this.bookableRoute));

        // BOOKINGS
        this.server.get(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.read.bind(this.bookingRoute));
        this.server.delete(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.delete.bind(this.bookingRoute));
        this.server.put(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.update.bind(this.bookingRoute));
        this.server.post(BOOKINGS_URL, this.bookingRoute.create.bind(this.bookingRoute));
        this.server.get(BOOKINGS_URL, this.bookingRoute.getFromBookableId.bind(this.bookingRoute));
    }

    start() {
        this.server.listen(
            this.options.port,
            () => console.log(`Server listening on: http://localhost:${this.options.port}`)
        );
    }

}
