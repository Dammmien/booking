const ObjectID = require('mongodb').ObjectID;
const Stripe = require('./Stripe');

module.exports = class BookingRoute {

    constructor(db, mailer) {
        this.db = db;
        this.mailer = mailer;
        this.collection = this.db.collection('bookings');
        this.stripe = new Stripe();
    }

    create(req, res) {
        this.collection.insert(req.body, (err, result) => {
            if (!err) {
                this.stripe.createCharge(req.body.token.id, 10000, `Payment for booking : ${result.ops[0]._id}`)
                res.send(result.ops[0]);
                this.mailer.sendBookingSuccess(req.body.token.email);
            }
        });
    }

    read(req, res) {
        this.collection.findOne({
            _id: new ObjectID(req.params.booking_id)
        }).then((result) => {
            res.send(result);
        });
    }

    delete(req, res) {
        this.collection.findAndRemove({
            _id: new ObjectID(req.params.booking_id)
        }).then((result) => {
            res.send(result.value);
        });
    }

    update(req, res) {
        this.collection.updateOne({
            _id: new ObjectID(req.params.booking_id)
        }, req.body, {
            upsert: true
        }).then((result) => {
            this.read(req, res);
        });
    }

    getFromBookableId(req, res) {
        this.collection.find({
            'bookable_id': req.params.bookable_id,
            'slot.start': {
                '$gte': Number(req.query.start)
            },
            'slot.end': {
                '$lte': Number(req.query.end)
            }
        }).toArray().then((result) => {
            res.send(result.map( booking => booking.slot ));
        });
    }

}
