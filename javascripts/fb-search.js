'use strict';

let $ = require('jquery');

let searchBar = {};

//searches firebase by user input and returns matches to that text.
searchBar.filterMovies = function(string, userMovies) {
	return new Promise(function(resolve, reject) {
		let filteredMovies = userMovies.filter(function(object) {
			return object.name.match(new RegExp(string, "i"));
		});
		resolve(filteredMovies);
		// TODO: reject
	});
};