'use strict';

let $ = require('jquery');
let movieController= {};
let newSearch = require('./apiMovieFactory');
let movieFactory = require('./fbMovieFactory');

	//see which radio button is checked, then launch search based on user input
movieController.runSearch = () => {
	let userInput = $("#userMessageInput").val();
	if ($('#yourMovies').is(':checked')) {
		// fbSearch.whatever();
		console.log("my movies checked and searched!");
	} else {
		newSearch.getMovies(userInput)
		.then ( function (results) {
			console.log("reslts", results);
		});
	}
};

module.exports = movieController;