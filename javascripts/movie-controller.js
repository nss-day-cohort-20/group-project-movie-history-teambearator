'use strict';

let $ = require('jquery');
let movieController= {};
let newSearch = require('./apiMovieFactory');
let actorUrl = "https://api.themoviedb.org/3/movie/";
let moviedbData = require("./api-getter")();

	//see which radio button is checked, then launch search based on user input

movieController.runSearch = () => {
	let userInput = $("#userMessageInput").val();
	if ($('#yourMovies').is(':checked')) {
		// fbSearch.whatever();
		console.log("my movies checked and searched!");

	} else {
		return new Promise (function (resolve, reject) {
			newSearch.getMovies(userInput)
			.then ( function (data) {
				console.log("reslts", data.results);
				let tenNewMovies = data.results.slice(0, 10);
				console.log("ten movies", tenNewMovies);
				let castPromisesArray = buildCastPromises(tenNewMovies);
				Promise.all(castPromisesArray)
				.then(function(data) {
					resolve(addActors(tenNewMovies, data));
				});
			});
			
		});
	}
};

function buildCastPromises (movieArray) {
	let movieIdArray = movieArray.map(function (item) {
		return item.id;
	});
	let castPromises = [];
	movieIdArray.forEach( (item) => {
		let url = `${actorUrl}${item}/credits?api_key=${moviedbData.api_key}`;
		castPromises.push(newSearch.getCastDetails(url));
	});

	console.log("movieIdArray", movieIdArray);
	return castPromises;
}
	// getActors(movieIdArray);



function addActors (movies, actors) {
	let castArrays = [];
	movies.forEach(function(movie, index) {
		let tenMovieCasts= actors[index].cast;
		//console.log("ten cast", tenMovieCasts);
		let shortCasts = tenMovieCasts.slice(0,3);
		castArrays.push(shortCasts);
		console.log("shortcasts", shortCasts);
		// tenMovieCasts.forEach(function(item) {
		// 	//let shortCast = item.slice(0,4);
		// });
	});
		console.log("cast arrays", castArrays);
		return buildMovieObjects(movies, castArrays);
}


//build the object that gets templateified -- need the actors
function buildMovieObjects (arrayOfMovies, castArrays) {
	console.log("array of movies", arrayOfMovies);
	for (let i=0; i<arrayOfMovies.length; i++) {
		arrayOfMovies[i].actors = castArrays[i];
	}
	console.log("movie objects", arrayOfMovies);
	return arrayOfMovies;
}


module.exports = movieController;