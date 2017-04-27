const express = require('express');
const app = express();
const bodyparser = require('body-parser');



var config = require('./config/config');
var dbReference = require('./modules/dbWrapper')
var dbWrapper = dbReference(config);

config.dataBase = '';
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


var routes = require('./routes/moviesRoutes');
routes(app, config);

console.log('sample hI1');



app.get('/', function (req, res) {
    //res.send('Hello');
    res.sendFile(__dirname + '/Home.html');
});

app.post('/quotes', (req, res) => {
    console.log(req.body);

    var callBack = (err, response) => {
        res.send('done');
    }

    dbWrapper.addDataToCollection({
        collectionName: 'quotes',
        data: req.body
    }, callBack);
});

app.get('/getquotes', (req, res) => {
    console.log(req.body);

    var callBack = (err, response) => {
        res.json(response);
    }

    dbWrapper.findfromCollections({
        collectionName: 'quotes',
        data: req.body
    }, callBack);
})

dbWrapper.connectToDb((db) => {
    if (db) {
        config.dataBase = db;
        app.listen(config.port, function () {
            console.log('listening on ' + config.port);
        })
    }
    else {
        console.log('cannot continue without connecting to Db');
    }
}
)