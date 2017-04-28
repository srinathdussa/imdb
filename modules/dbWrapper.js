var collections = {
    Movies: 'movies',
    Actors: 'actors'

}


module.exports = (config) =>{

    const MongoClient = require('mongodb').MongoClient;

   
    var db;
    var ObjectID = require('mongodb').ObjectID;
    var mongo = {
        
        connectToDb: (callback) => {

            MongoClient.connect(config.dburl, (err, database) => {
                if (err) {
                    console.log(err);
                    callback(false);
                }
                db = database
                callback(db);
            });

        },
        addDataToCollection: (params, cb) =>{
            
            db.collection(params.collectionName).save(params.data, (err, result) => {
                if (err) {
                    console.log(err)
                    cb(true);
                }
                console.log('saved to database')
                cb(undefined,true);
                
            })

        },
        findfromCollections: (params, cb) => {
            var collectionName = params.collectionName;

            db.collection(collectionName).find().toArray((err, result) => {
                if (err) {
                    console.log(err)
                    cb(true);
                }
                console.log('saved to database')
                cb(undefined, { result: result });
                
            })
        },

        getMovies: (params, callback) => {
            db.collection(collections.Movies).find().toArray(callback);
        },

        addMovie: (params,callback) => {
            db.collection(collections.Movies).insertOne(params, function (err, data) {
             
                callback(err, data);
            });
        },

        getMovie: (params, callback) => {
            console.log(params);
            db.collection(collections.Movies).find({ _id: new ObjectID(params.id) }).toArray(callback);
        },

        updateMovie: (params, callback) => {

            db.collection(collections.Movies).findOne({ _id: new ObjectID(params.id) }, function (err, data) {
                console.log(data);
                if (err) {
                    response = { "error": true, "message": "Error fetching data" };
                } else {
                    // we got data from Mongo.
                    // change it accordingly.
                    if (params.name !== undefined) {
                        data.name = params.name;
                    }
                    if (params.language !== undefined) {
                        data.language = params.language;
                    }
                    if (params.year_released !== undefined) {
                        data.year_released = params.year_released;
                    }
                    data.actors = params.actors;
                    // save the data
                    db.collection(collections.Movies).save(data, callback)
                }
            });
        },

        deleteMovie: (params, callback) => {
            db.collection(collections.Movies).deleteOne({ _id: new ObjectID(params.id) }, callback);            
        },


        //Actors API Begin
        getActors: (params, callback) => {
            db.collection(collections.Actors).find().toArray(callback);
        },

        addActor: (params, callback) => {
            db.collection(collections.Actors).insertOne(params, function (err, data) {

                callback(err, data);
            });
        },

        getActor: (params, callback) => {

            db.collection(collections.Actors).find({ _id: new ObjectID(params.id) }).toArray(callback);
        },
        //Actors API END


        //Movie and Actors API
        getMoviesByActorName: (params, callback) => {
            //db.collection(collections.Movies).find({ 'actors': { 'Name': '/' + params.name + '/' } }).toArray(callback);
            //db.collection(collections.Movies).find({ 'actors.Name': /params.name/ }).toArray(callback);
            db.collection(collections.Movies).find({ 'actors.Name': new RegExp(params.name, "ig") }).toArray(callback);
            
        }

    }
    return mongo;
}