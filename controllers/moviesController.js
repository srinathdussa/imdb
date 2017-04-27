
module.exports = function (config) {

    return {
        list_all_movies: function (req, res) {
            var db = config.dataBase;
            var callBack = (err, data) => {
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": { movies: data } };
                }
                res.json(response);
            }

            db.collection('movies').find().toArray(callBack);
        },

        add_movie: function (req, res) {
            console.log(req.body);
            var db = config.dataBase;
            var movieDoc = {};
            // Add strict validation when you use this in Production.
            movieDoc.name = req.body.name;
            movieDoc.language = req.body.language;
            movieDoc.year_released = req.body.year_released;
            db.collection('movies').insertOne(movieDoc,function (err, data) {
                var response = {};
                if (err) {
                    response = { "error": true, "message": "Error adding data" };
                } else {
                    response = { "error": false, "message": "Data added" };
                }
                res.json(response);
            });
        },

        get_movie: function (req, res) {
            var db = config.dataBase;
            var response = {};

            var ObjectID = require('mongodb').ObjectID;

            db.collection('movies').find({ _id: new ObjectID(req.params.id) }).toArray(function (err, data) {
                // This will run Mongo Query to fetch data based on ID.
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": data };
                }
                res.json(response);
            });
        },

        update_movie: function (req, res) {
            var response = {};
            var db = config.dataBase;
            // first find out record exists or not
            // if it does then update the record
            var ObjectID = require('mongodb').ObjectID;

            db.collection('movies').findOne({ _id: new ObjectID(req.params.id) }, function (err, data) {
                console.log(data);
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    // we got data from Mongo.
                    // change it accordingly.
                    if (req.body.name !== undefined) {
                        data.name = req.body.name;
                    }
                    if (req.body.language !== undefined) {
                        data.language = req.body.language;
                    }
                    if (req.body.year_released !== undefined) {
                        data.year_released = req.body.year_released;
                    }
                    // save the data
                    db.collection('movies').save(data, function (err) {
                        if (err) {
                            response = { "error": true, "message": "Error updating data" };
                        } else {
                            response = { "error": false, "message": "Data is updated for " + req.params.id };
                        }
                        res.json(response);
                    })
                }
            });
        },

        delete_movie: function (req, res) {
            var db = config.dataBase;
            var response = {};
            // find the data
            var ObjectID = require('mongodb').ObjectID;
            db.collection('movies').deleteOne({ _id: new ObjectID(req.params.id) }, function (err, data) {

                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    // data exists, remove it.


                    response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };

                    res.json(response);

                }
            });
        }
    }
}

