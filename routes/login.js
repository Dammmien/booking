const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

module.exports = class LoginRoute {

    constructor(db, app) {
        this.db = db;
        this.app = app;
        this.collection = this.db.collection('users');
    }

    authError(res) {
        res.status(401).send({
            success: false,
            message: 'No user or invalid password.'
        });
    }

    log(req, res) {
        this.collection.findOne({
            email: req.body.email
        }).then((user) => {
            if (!user || user.password !== req.body.password) {
                this.authError(res);
            } else {
                const token = jwt.sign(user, this.app.get('secret'));
                res.send({user, token});
            }
        });
    }

}
