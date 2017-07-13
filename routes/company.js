const ObjectID = require('mongodb').ObjectID;

module.exports = class CompanyRoute {

    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('companies');
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
            _id: new ObjectID(req.params.company_id)
        }).then((result) => {
            res.send(result);
        });
    }

    delete(req, res) {
        this.collection.findAndRemove({
            _id: new ObjectID(req.params.company_id)
        }).then((result) => {
            res.send(result.value);
        });
    }

    update(req, res) {
        this.collection.updateOne({
            _id: new ObjectID(req.params.company_id)
        }, req.body, {
            upsert: true
        }).then((result) => {
            this.read(req, res);
        });
    }

}
