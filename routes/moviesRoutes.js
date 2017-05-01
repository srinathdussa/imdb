var moviescontroller = require('../controllers/moviesController');
var actorscontroller = require('../controllers/actorsController');

module.exports = function (app, config) {

    var movies = moviescontroller(config);
    var actors = actorscontroller(config);

	app.route('/movies')
		.get(movies.list_all_movies)
		.post(movies.add_movie);

	app.route('/movies/:id')
		.get(movies.get_movie)
		.put(movies.update_movie)
		.delete(movies.delete_movie);


	app.route('/moviesbyactorname/:name')
		.get(movies.getmoviesbyActor);


	app.route('/actors')
		.get(actors.list_all_actors)
		.post(actors.add_actor);

    app.route('/actors/:id')
		.get(actors.get_actor)
		.put(actors.update_actor)
		.delete(actors.delete_actor);

};