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
		newSearch.getMovies(userInput)
		.then ( function (data) {
			console.log("reslts", data.results);
			let tenNewMovies = data.results.slice(0, 10);
			console.log("ten movies", tenNewMovies);
			getMovieID(tenNewMovies);
		});
	}
};

function getMovieID (movieArray) {
	let movieIdArray = movieArray.map(function (item) {
		return item.id;
	});
	console.log("movieIdArray", movieIdArray);
	getActors(movieIdArray);
}

function getActors (movieIds) {
	let castPromises = [];
	movieIds.forEach( (movie) => {
		let url = `${actorUrl}${movie}/credits?api_key=${moviedbData.api_key}`;
	castPromises.push(newSearch.getCastDetails(url));
	});
}


//build the object that gets templateified -- need the actors
movieController.buildMovieObject = (arrayOfMovies) => {
	arrayOfMovies.forEach(function(item) {

		
	});
};


module.exports = movieController;