// search string first part:   https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=?

'use strict';

console.log("It's connected");

let moviedbData = require("./api-getter")();
let $ = require('jquery');
let api_key = require('./api-config.js');
let apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=";
let newSearch = {};


$('#userMessageInput').keyup( function () {

});

$('#messageSubmitButton').click ( function () {
	console.log("button clicked");
	let userInput = $("#userMessageInput").val();
	newSearch.getMovies(userInput)
	.then ( function (results) {
		console.log("reslts", results);
	});
});

//make a function that replaces ' ' with '+' in the user input 

newSearch.getMovies = (searchString) => {
	return new Promise ( (resolve, reject) => {
		$.ajax({
			url: `${apiUrl}${moviedbData.api_key}&query=?${searchString}`
		}).done(function(data) {
			console.log("data", data);
			resolve(data);
		});
		//use the apiUrl, the api_key, and the search string with + in between each space
	});
};
