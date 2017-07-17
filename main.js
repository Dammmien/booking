const App = require('./App');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017/local';

MongoClient.connect(MONGO_URL, (err, db) => {

    const app = new App({
        port: process.env.npm_package_config_port,
        db: db
    });

    app.start();

});
