var collections = {
    Movies: 'movies',
    Actors: 'actors',
    Directors: 'directors',
    Persons: 'persons'
}
var roleTypes = {
    Actor: "1",
    Director: "2"
}

module.exports = (config) => {

    const MongoClient = require('mongodb').MongoClient;


    var db;
    var ObjectID = require('mongodb').ObjectID;
    var mongo = {
    };
    mongo.connectToDb = (callback) => {

        MongoClient.connect(config.dburl, (err, database) => {
            if (err) {
                console.log(err);
                callback(false);
            }
            db = database
            callback(db);
        });

    };

    mongo.addDataToCollection = (params, cb) => {

        db.collection(params.collectionName).save(params.data, (err, result) => {
            if (err) {
                console.log(err)
                cb(true);
            }
            console.log('saved to database')
            cb(undefined, true);

        })

    };

    mongo.findfromCollections = (params, cb) => {
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

    mongo.getMovies = (params, callback) => {
        db.collection(collections.Movies).find().toArray(callback);

    };

    mongo.addMovie = (params, callback) => {

        params.Roles = [];
        var saveMovie = () => {
            params._id = params.name;
            db.collection(collections.Movies).save(params, function (err, data) {

                callback(err, data);
            });
        }
        if (params.actors && params.actors.length > 0) {
            //var personsToAdd = params.actors.filter(function (obj) { return !obj._id });
            var actorIdsModifed = [];
            for (var i = 0; i < params.actors.length; i++) {
                //delete personsToAdd[i]._id;
                console.log('id ', params.actors[i]._id);
                console.log('name ', params.actors[i].Name);
                if (params.actors[i]._id != undefined && params.actors[i]._id != params.actors[i].Name) {

                    actorIdsModifed.push(params.actors[i]._id);
                }
                params.actors[i]._id = params.actors[i].Name;
            }
            if (actorIdsModifed.length > 0) {
                mongo.deleteActors(actorIdsModifed);
            }

            mongo.saveActors(params.actors, (err, personsAdded) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                for (var i = 0; i < params.actors.length; i++) {
                    params.Roles.push({
                        RoleId: params.actors[i].roleTypeId,
                        personId: params.actors[i]._id
                    })
                }
                delete params.actors;
                saveMovie();
            })

        }
        else
            saveMovie();

    };

    mongo.getMovie = (params, callback) => {
        console.log(params);


        db.collection(collections.Movies).aggregate([
            {
                $match: { _id: params.id }
            },

            { $unwind: "$Roles" },
            {
                $lookup: {
                    from: collections.Persons,
                    localField: "Roles.personId",
                    foreignField: "_id",
                    as: "actors"
                }
            },
        {
            $group: {
                _id: {
                    _id: "$_id"
                    , name: "$name"
                    , language: "$language"
                    , year_released: "$year_released"
                },
                //name:"$_name",
                actors: { $push: { actor: "$actors", roleTypeId: "$Roles.RoleId" } }
            }
        },
            {
                $project: {
                    _id: 1,
                    //name:"$_id.name",
                    actors: 1
                }
            }
        ]).toArray((err, data) => {

            if (data && data.length > 0) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var movieObj = data[i];
                    console.log(movieObj);
                    movieObj.name = movieObj._id.name;
                    movieObj.language = movieObj._id.language;
                    movieObj.year_released = movieObj._id.year_released;
                    movieObj._id = movieObj._id._id;
                    //data
                    if (movieObj.actors) {
                        for (var i = 0, len = movieObj.actors.length; i < len; i++) {
                            var actorObj = movieObj.actors[i];
                            if (actorObj.actor.length > 0) {
                                //console.log('actula ',actorObj);
                                actorObj.actor[0].RoleTypeId = actorObj.roleTypeId;
                                actorObj = actorObj.actor[0];
                            }
                            movieObj.actors[i] = actorObj;
                            //console.log('modified ', actorObj);
                        }
                    }
                }
            }

            callback(err, data)
        }
        );
    };

    mongo.updateMovie = (params, callback) => {

        var saveMovie = function (err, data) {
            mongo.addMovie(params, callback);
        }
        if (params.id != params.name) {
            db.collection(collections.Movies).deleteOne({ _id: params.id }, saveMovie);
        }
        else {
            saveMovie();
        }


    };

    mongo.deleteMovie = (params, callback) => {
        db.collection(collections.Movies).deleteOne({ _id: params.id }, callback);
    };




    //Movie and Actors API
    mongo.getMoviesByActorName = (params, callback) => {
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
        var onDone = (err, obj) => {
            if (err)
                callback(err, result);
            else {
                result.push(obj);
                if (result.length == count) {
                    callback(err, result);//when all are saved
                }
            }
        }

        for (var i = 0; i < count; i++)            
            db.collection(collections.Persons).save(params[i], onDone);
    }

    mongo.deleteActors = (params, callback) => {
        //params expected array of ids
        console.log('deete', params);
        db.collection(collections.Persons).deleteMany({ _id: { $in: params } }, function (err, data) {
            if (callback)
                callback(err, data);
        });
    };

    var getPersons = (params, callback) => {
        db.collection(collections.Persons).find({
            roleTypeId: params.RoleTypeId
        }).toArray(callback);
    };

    //Actors API Begin
    mongo.getAllActors = (params, callback) => {
        getPersons({ RoleTypeId: roleTypes.Actor }, callback)
    };

    mongo.addActor = (params, callback) => {
        //save persons
        //delete all matching persons in movies
        //embed only the ones in the list
        params._id = params.name;
        var movieIdsToLink=[];
        for(var i=0;i<params.movies.length;i++){
            movieIdsToLink.push(params.movies[i].name);
        }
        delete params.movies;

        mongo.saveActors([params], (err, data) => {

            db.collection(collections.Movies).update(
                {},
            {
                $pull: { Roles: { personId: params._id } }
            },
            { multi: true });

            
            if(movieIdsToLink.length>0){//insert 

                db.collection(collections.Movies).update(
                    { _id: {$in :movieIdsToLink}},
            {
                $push: {
                    Roles: {
                        "RoleId": roleTypes.Actor,
                        "personId": params._id
                    }
                }
            });
            }
        });

    };

    mongo.getActor = (params, callback) => {

        //db.collection(collections.Persons).find({ _id: new ObjectID(params.id) }).toArray(callback);


        db.collection(collections.Persons).aggregate([
            {
                $match: { _id: params.id }
            },
            {
                $lookup: {
                    from: collections.Movies,
                    localField: "_id",
                    foreignField: "Roles.personId",
                    as: "movies"
                }
            }
        ]).toArray(callback);

    };

    mongo.updateActor = (params, callback) => {
        var savePerson = function (err, data) {
            mongo.addActor(params, callback);

        }
        if (params.id != params.Name) {//delete all movie references with old name
            db.collection(collections.Movies).update(
            {},
        {
            $pull: { Roles: { personId: params._id } }
        },
        { multi: true });
            db.collection(collections.Persons).deleteOne({ _id: params.id }, savePerson);

        }
        else {
            savePerson();
        }
    }

    mongo.deleteactor = (params, callback) => {
        console.log('delete ', params.id)
        db.collection(collections.Persons).deleteOne({ _id: params.id }, callback);
    };
    //Actors API END



    return mongo;
}