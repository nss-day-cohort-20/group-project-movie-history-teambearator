'use strict';
// get all stuff from api
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

newSearch.getCastDetails = (url) => {
	return new Promise ((resolve, reject) => {
		$.ajax({
			url: url
		}).done(function(castData) {
		resolve(castData);
		});
	});
};

module.exports = newSearch;