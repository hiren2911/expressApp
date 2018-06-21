var express = require('express');
var mongo = require('mongodb').MongoClient;
// to search from id
var ObjectId = require('mongodb').ObjectID;

// to access post object
var bodyParser = require('body-parser');
var app = express();

// function errorHandler(err) {
//     throw err;
// }
// app.use(errorHandler);

app.set('dbUrl', 'mongodb://t2:test123@ds255970.mlab.com:55970/demoapp');
app.set('dbName', 'demoapp');
var db;

app.use(bodyParser.json());


app.route('/trades')
    .get((req, res) => {
        db.collection('trades').find().sort({ shares: -1 }).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        })
    })
    .post((req, res) => {
        // console.log(req.body.type);

        db.collection('trades').insert(req.body, function(err, data) {
            if (err) throw err;
            // console.log(data);
            res.status(201).send(data);
        });
    });

app.route('/trades/:id')
    .get((req, res) => {
        db.collection('trades').find({ '_id': ObjectId(req.params.id) }).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    })
    .post((req, res) => {
        // console.log(req.body.type);

        db.collection('trades').update({ "_id": ObjectId(req.params.id) }, req.body, function(err, data) {
            if (err) throw err;
            // console.log(data);
            res.status(201).send(data);
        });
    });


app.get('/trades/types/:type', (req, res) => {
    // To make it case insensitive need to make regex
    var regex = new RegExp(["^", req.params.type, "$"].join(""), "i");
    db.collection('trades').find({ 'type': regex }).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    })
});


app.all('*', (req, res) => {
    res.sendStatus(404);
});


mongo.connect(app.get('dbUrl'), (err, client) => {
    if (err) {
        console.log('Error while connecting database');
        throw err;
    }
    db = client.db(app.get('dbName'));
    app.listen(8080, () => {
        console.log('server has started');
    });
});