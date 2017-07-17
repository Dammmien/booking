const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

const BASE_URL = '/api/v1';

const Mailer = require('./modules/Mailer');

const BookingRoute = require('./routes/booking');
const BookableRoute = require('./routes/bookable');
const CompanyRoute = require('./routes/company');
const LoginRoute = require('./routes/login');

module.exports = class App {

    constructor(options) {
        this.options = options;

        this.initApp();
        this.initMailer();
        this.initPublicRouter();
        this.initAuthenticatedRouter();
        this.setRouters();

        this.bookingRoute = new BookingRoute(this.options.db, this.mailer);
        this.bookableRoute = new BookableRoute(this.options.db);
        this.companyRoute = new CompanyRoute(this.options.db);
        this.loginRoute = new LoginRoute(this.options.db, this.app);

        this.setRoutes();
    }

    initApp() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(express.static(__dirname + '/front'));
        this.app.set('secret', 'config-secret-key-to-change');
    }

    initPublicRouter() {
        this.publicRouter = express.Router();
        this.publicRouter.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
    }

    initAuthenticatedRouter() {
        this.authenticatedRouter = express.Router();

        this.authenticatedRouter.use((req, res, next) => {
            const tokenRegex = /(\S*)\s(\S*)/g;
            const tokenMatch = tokenRegex.exec(req.headers['authorization']);

            if (tokenMatch) {
                jwt.verify(tokenMatch[2], this.app.get('secret'), (err, decoded) => {
                    if (err) {
                        return res.status(401).send({
                            success: false,
                            message: 'Impossible to decode token'
                        });
                    } else {
                        req.user = decoded;
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
    }

    setRouters() {
        this.app.use(`${BASE_URL}/public`, this.publicRouter);
        this.app.use(`${BASE_URL}/admin`, this.authenticatedRouter);
    }

    setRoutes() {
        const BOOKABLES_URL = `/companies/:company_id/bookables`;
        const BOOKINGS_URL = `${BOOKABLES_URL}/:bookable_id/bookings`;

        this.app.get('/', function(req, res) {
            res.sendFile(__dirname + '/front/index.html');
        });

        this.app.post(`${BASE_URL}/login`, this.loginRoute.log.bind(this.loginRoute));

        // COMPANIES
        this.authenticatedRouter.get('/companies/:company_id', this.companyRoute.read.bind(this.companyRoute));
        this.authenticatedRouter.delete('/companies/:company_id', this.companyRoute.delete.bind(this.companyRoute));
        this.authenticatedRouter.put('/companies/:company_id', this.companyRoute.update.bind(this.companyRoute));
        this.authenticatedRouter.post('/companies', this.companyRoute.create.bind(this.companyRoute));


        // BOOKABLES
        this.publicRouter.get(`${BOOKABLES_URL}/:bookable_id`, this.bookableRoute.read.bind(this.bookableRoute));
        this.publicRouter.get(BOOKABLES_URL, this.bookableRoute.getFromCompanyId.bind(this.bookableRoute));

        this.authenticatedRouter.delete(`${BOOKABLES_URL}/:bookable_id`, this.bookableRoute.delete.bind(this.bookableRoute));
        this.authenticatedRouter.put(`${BOOKABLES_URL}/:bookable_id`, this.bookableRoute.update.bind(this.bookableRoute));
        this.authenticatedRouter.post(BOOKABLES_URL, this.bookableRoute.create.bind(this.bookableRoute));


        // BOOKINGS
        this.publicRouter.get(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.read.bind(this.bookingRoute));
        this.publicRouter.get(BOOKINGS_URL, this.bookingRoute.getFromBookableId.bind(this.bookingRoute));

        this.authenticatedRouter.delete(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.delete.bind(this.bookingRoute));
        this.authenticatedRouter.put(`${BOOKINGS_URL}/:booking_id`, this.bookingRoute.update.bind(this.bookingRoute));

        // this.authenticatedRouter.post(BOOKINGS_URL, this.bookingRoute.create.bind(this.bookingRoute));
        this.publicRouter.post(BOOKINGS_URL, this.bookingRoute.create.bind(this.bookingRoute));
    }

    initMailer() {
        this.mailer = new Mailer();
    }

    start() {
        this.app.listen(
            this.options.port,
            () => console.log(`Server listening on: http://localhost:${this.options.port}`)
        );
    }

}
