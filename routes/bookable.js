const ObjectID = require('mongodb').ObjectID;

module.exports = class BookableRoute {

    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('bookables');
    }

    create(req, res) {
        this.collection.insert(req.body, (err, result) => {
            if (!err) {
                res.send(result.ops[0]);
            }
        });
    }

    read(req, res) {
        this.collection.findOne({
            _id: new ObjectID(req.params.bookable_id)
        }).then((result) => {
            res.send(result);
        });
    }

    delete(req, res) {
        this.collection.findAndRemove({
            _id: new ObjectID(req.params.bookable_id)
        }).then((result) => {
            res.send(result.value);
        });
    }

    update(req, res) {
        this.collection.updateOne({
            _id: new ObjectID(req.params.bookable_id)
        }, req.body, {
            upsert: true
        }).then((result) => {
            this.read(req, res);
        });
    }

    getFromCompanyId(req, res) {
        this.collection.find({
            company: req.params.company_id
        }).toArray().then((result) => {
            res.send(result);
        });
    }

}
