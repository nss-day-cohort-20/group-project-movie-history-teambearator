// search string first part:   https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=?

'use strict';

console.log("It's connected");

let $ = require('jquery');
let moviedbData = require("./api-getter")();
let api_key = require('./api-config.js');
let apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=";
let newSearch = {};


newSearch.getMovies = (searchString) => {
	return new Promise ( (resolve, reject) => {
		$.ajax({
			url: `${apiUrl}${moviedbData.api_key}&query=?${searchString}`
		}).done(function(data) {
			console.log("data", data);
			resolve(data);
		});
		//TODO make a reject statement
	});
};


module.exports = newSearch;