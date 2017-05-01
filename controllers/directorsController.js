
module.exports = function (config) {

    return {
        list_all_directors: function (req, res) {
            
            var callback = (err, data) => {
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    response = { "error": false, "message": { actors: data } };
                }
                res.json(response);
            }
            config.dbWrapper.getAllDirectors({}, callback);
            
        },

        add_director: function (req, res) {
            var movieDoc = req.body;
            
            // Add strict validation when you use this in Production.
            //movieDoc.name = req.body.name;
            //movieDoc.language = req.body.language;
            //movieDoc.year_released = req.body.year_released;
            var callback = function (err, result) {
                var response = {};
                if (err) {
                    response = { "error":
                        true, "message": "Error adding data" };
                } else {
                    response = { "error": false, "message": result };
                }
                res.json(response);
            }
            config.dbWrapper.addDirector(movieDoc, callback);
        },

        get_director: function (req, res) {
        
            var response = {};
           

            var callback = function (err, data) {
                //console.log('datahere',data);
                // This will run Mongo Query to fetch data based on ID.
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    if (data.length > 0) {
                        data = data[0];
                    }
                    response = { "error": false, "message": data };
                }
                res.json(response);
            }
            config.dbWrapper.getDirector(req.params, callback);
            
        },

        update_director: function (req, res) {
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
            config.dbWrapper.updateDirector(params, callback);

        },

        delete_director: function (req, res) {
            var db = config.dataBase;
            var response = {};
            // find the data
            
            var callback= function (err, data) {

                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {

                    response = { "error": true, "message": "Data associated with " + req.params.id + "is deleted" };

                    res.json(response);

                }
            };
            config.dbWrapper.deleteDirector(req.params, callback);
        },



        


    
    }
}

