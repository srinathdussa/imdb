var moviescontroller = require('../controllers/moviesController');

module.exports = function (app, config) {

    var movies = moviescontroller(config);


	app.route('/movies')
		.get(movies.list_all_movies)
		.post(movies.add_movie);

	app.route('/movies/:id')
		.get(movies.get_movie)
		.put(movies.update_movie)
		.delete(movies.delete_movie);


	app.route('/moviesbyactorname/:name')
		.get(movies.getmoviesbyActor);
};