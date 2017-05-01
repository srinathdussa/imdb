
module.exports = function (config) {

    return {
        list_all_movies: function (req, res) {
            
            var callback = (err, data) => {
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": { movies: data } };
                }
                res.json(response);
            }
            config.dbWrapper.getMovies({}, callback);
            
        },

        add_movie: function (req, res) {
            var movieDoc = req.body;
            // Add strict validation when you use this in Production.
            //movieDoc.name = req.body.name;
            //movieDoc.language = req.body.language;
            //movieDoc.year_released = req.body.year_released;
            var callback = function (err, result) {
                var response = {};
                if (err) {
                    response = { "error": true, "message": "Error adding data" };
                } else {
                    response = { "error": false, "message": result };
                }
                res.json(response);
            }
            config.dbWrapper.addMovie(movieDoc,callback);
        },

        get_movie: function (req, res) {
        
            var response = {};
           

            var callback = function (err, data) {
                //console.log('datahere',data);
                // This will run Mongo Query to fetch data based on ID.
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": data };
                }
                res.json(response);
            }
            config.dbWrapper.getMovie(req.params, callback);
            
        },

        update_movie: function (req, res) {
            var response = {};
            
            // first find out record exists or not
            var callback = function (err, data) {
                // This will run Mongo Query to fetch data based on ID.
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": data };
                }
                res.json(response);
            }
            var params=req.body;
            params.id=req.params.id;//populate id
            config.dbWrapper.updateMovie(params, callback);

        },

        delete_movie: function (req, res) {
            var db = config.dataBase;
            var response = {};
            // find the data
            var ObjectID = require('mongodb').ObjectID;
            var callback= function (err, data) {

                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {

                    response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };

                    res.json(response);

                }
            };
            config.dbWrapper.deleteMovie(req.params, callback);
        },



        list_all_actors: function (req, res) {
        
            var callback = (err, data) => {
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                response = { "error": false, "message": { movies: data } };
            }
            res.json(response);
        }
        config.dbWrapper.getActors({}, callback);
        
    },

    add_actor: function (req, res) {
        var actor = req.body;

        var callback = function (err, result) {
            var response = {};
            if (err) {
                response = { "error": true, "message": "Error adding data" };
            } else {
                response = { "error": false, "message": params };
            }
            res.json(response);
        }
        config.dbWrapper.addActor(actor, callback);
    },


    getmoviesbyActor: function (req, res) {

        var response = {};


        var callback = function (err, data) {
            console.log('datahere', data);
            // This will run Mongo Query to fetch data based on ID.
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
                response = { "error": false, "message": data };
            }
            res.json(response);
        }
        config.dbWrapper.getMoviesByActorName(req.params, callback);
    },
    }
}

