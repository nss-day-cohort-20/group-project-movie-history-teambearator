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

let getMovieDetails = (movieId) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`
		}).done( (movieDetails) => {
			console.log('movieDetails', movieDetails);
			resolve(movieDetails);
		}).fail((err)=>{
			console.log('error from actorSearch ajax');
			reject(err);
		});
	});
};

newSearch.getMovieDetailsWithCast = (movieId) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${moviedbData.api_key}&append_to_response=credits`
		}).done( (movieDetailsAndCredits) => {
			console.log('movieDetails with Cast', movieDetailsAndCredits);
			resolve(movieDetailsAndCredits);
		}).fail((err)=>{
			console.log('error from Details with Cast Search ajax');
			reject(err);
		});
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