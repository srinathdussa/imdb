var collections = {
    Movies: 'movies',
    Actors: 'actors',
    Directors:'directors',
    Persons:'persons'
}
var roleTypes={
    Actor:1,
    Director:2
}

module.exports = (config) =>{

    const MongoClient = require('mongodb').MongoClient;

   
    var db;
    var ObjectID = require('mongodb').ObjectID;
    var mongo = {
    };
    mongo.connectToDb= (callback) => {

        MongoClient.connect(config.dburl, (err, database) => {
            if (err) {
                console.log(err);
                callback(false);
            }
            db = database
            callback(db);
        });

    };

    mongo.addDataToCollection= (params, cb) =>{
            
        db.collection(params.collectionName).save(params.data, (err, result) => {
            if (err) {
                console.log(err)
                cb(true);
            }
            console.log('saved to database')
            cb(undefined,true);
                
        })

    };

    mongo.findfromCollections= (params, cb) => {
        var collectionName = params.collectionName;

        db.collection(collectionName).find().toArray((err, result) => {
            if (err) {
                console.log(err)
                cb(true);
            }
            console.log('saved to database')
            cb(undefined, { result: result });
                
        })
    };

    mongo.getMovies= (params, callback) => {
        db.collection(collections.Movies).find().toArray(callback);
    };

    mongo.addMovie= (params, callback) => {

        params.Roles = [];
        var saveMovie = () => {
            params._id = params.name;
            db.collection(collections.Movies).save(params, function (err, data) {

                callback(err, data);
            });
        }
        if (params.actors && params.actors.length > 0) {
            //var personsToAdd = params.actors.filter(function (obj) { return !obj._id });
            for (var i = 0; i < params.actors.length; i++) {
                //delete personsToAdd[i]._id;
                params.actors[i]._id = params.actors[i].Name;
                
            }

            mongo.saveActors(params.actors, (err, personsAdded) => {

                if (err) {
                    callback(err, undefined);
                    return;
                }
                for (var i = 0; i < params.actors.length; i++) {
                    params.Roles.push({
                        RoleId: roleTypes.Actor,
                        personId: params.actors[i]._id
                    })
                }
                delete params.actors;
                saveMovie();
            })
            
            //var personsToUpdate = params.actors.filter(function (obj) { return obj._id });
            //mongo.addActor(personsToAdd, (err, personsAdded) => {
            //    console.log(personsAdded);
            //    for (var i = 0; i < personsAdded.length; i++) {
            //        params.Roles.push({
            //            RoleId: roleTypes.Actor,
            //            personId: personsAdded[i]._id
            //        })
            //    }
            //    delete params.actors;
            //    saveMovie();
            //})  
            //update person here
        }
        else
            saveMovie();
            
    };

    mongo.getMovie= (params, callback) => {
        console.log(params);
        //_id: new ObjectID(params.id)
        //db.collection(collections.Movies).find({ _id: params.id }).toArray(
        //    (err, movies) =>{
        //        if (err || movies.length==0)
        //            callback(err, movies);
        //        else {
        //            var persons = movies[0].persons;
        //            db.collection(collections.Persons).find({ _id: {$in:[]}})
        //        }
        //    }                
        //    );

        db.collection(collections.Movies).aggregate([
            {
                $match: { _id: params.id }
            },
            
            { $unwind: "$Roles" },
            { $lookup: {
                from: collections.Persons,
                localField: "Roles.personId",
                foreignField: "_id",
                as: "actors"
            }
            },
        {
            $group: {
                _id: {_id:"$_id", name:"$name"},
                //name:"$_name",
                actors: { $push: "$actors" }
            }
        },
            {
                $project: {
                    _id: 1,
                    //name:"$_id.name",
                    actors: 1
                }
            }
        ]).toArray(
        callback
        );
    };

    mongo.updateMovie= (params, callback) => {

        db.collection(collections.Movies).findOne({ _id: params.id }, function (err, data) {
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
    };

    mongo.deleteMovie= (params, callback) => {
        db.collection(collections.Movies).deleteOne({ _id: params.id }, callback);            
    };


    //Actors API Begin
    mongo.getActors= (params, callback) => {
        db.collection(collections.Actors).find().toArray(callback);
    };

    mongo.addActor = (params, callback) => {
        
        db.collection(collections.Actors).insert(params, function (err, data) {
            
            callback(err, params);
        });
    };

    mongo.getActor= (params, callback) => {

        db.collection(collections.Actors).find({ _id: new ObjectID(params.id) }).toArray(callback);
    };
    //Actors API END


    //Movie and Actors API
    mongo.getMoviesByActorName= (params, callback) => {
        //db.collection(collections.Movies).find({ 'actors': { 'Name': '/' + params.name + '/' } }).toArray(callback);
        //db.collection(collections.Movies).find({ 'actors.Name': /params.name/ }).toArray(callback);
        db.collection(collections.Movies).find({ 'actors.Name': new RegExp(params.name, "ig") }).toArray(callback);
            
    };

    mongo.addPersons = (params, callback) => {
        db.collection(collections.Persons).insert(params, function (err, data) {
            callback(err, data);
        });
    };

    mongo.saveActors = (params, callback) => {
        //expecting params as array
        var count = params.length;
        var result = [];
        var onDone = (err,obj) =>{
            if (err)
                callback(err, result);
            else {
                result.push(obj);
                if (result.length == count) {
                    callback(err, result);//when all are saved
                }
            }
        }

        for (var i = 0; i < count;i++)
            db.collection(collections.Persons).save(params[i], onDone);
    }

    
    return mongo;
}