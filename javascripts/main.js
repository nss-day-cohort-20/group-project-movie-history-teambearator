'use strict';

let $ = require('jquery');
let movieFactoryAPI = require('./apiMovieFactory.js');
let movieController = require('./movie-controller.js');
let userFactory = require('./user-factory.js');
let movieFactory = require('./fbMovieFactory.js');
let templateBuilder = require('./template-builder.js');
//let apiGetter = require('./api-config.js');
//event listeners

$("#login").click(function() {
	userFactory.logInGoogle()
	//wrapped in promises automatically
	.then((result)=>{
		let user = result.user.uid;
		console.log("user", user);
 		// movieController.loadMoviesToDom();
 		$('#logout').toggleClass('isHidden');
 		$('#login').toggleClass('isHidden');
	});
});

//user can log out by clicking logout button and page refreshes
$("#logout").click(function(){
	userFactory.logOutGoogle();
});

//ERROR ERROR ERROR!!!!
//whether the user hits enter or clicks "submit" they run the search function
$('#userMessageInput').keyup( function (event) {
	if (event.which == '13' && $('#userMessageInput').val() !== "") {
		let moviesSearchedFromAPI;
		movieController.runSearchInAPI()
		.then(function(moviesSearched) {
			moviesSearchedFromAPI = moviesSearched;
			console.log("movies searched", moviesSearchedFromAPI);
			return movieFactory.getUserMovies();
		})
		.then(function(usersMovies) {
			let arrayifiedUsersMovies = Object.values(usersMovies);
			movieController.filterOutUserMovies(arrayifiedUsersMovies, moviesSearchedFromAPI);
		});
		// movieController.runSearch()
		// .then ( (movieObjects) => {
		// 	console.log("movie objects", movieObjects);
		$('#userMessageInput').val("");
	}
});



//add watchlist button adds
$(document).on("click", '.watchlist', function() {
	let movieId = $(this).parent().parent().attr('id');
	console.log("movieId", movieId);
	let movieMatch = movieController.selectedMovies;
	console.log("selected movies?", movieMatch);
	for(var i = 0; i < movieMatch.length; i++) {
		if(movieMatch[i].id == movieId) {
			movieFactory.addMovie(movieMatch[i]);
			console.log(movieMatch[i]);
		}
	}
});

$('#messageSubmitButton').click ( function () {
	// movieController.runSearch();
});

