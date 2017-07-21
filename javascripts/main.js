'use strict';

let $ = require('jquery');
let movieFactoryAPI = require('./apiMovieFactory.js');
let movieController = require('./movie-controller.js');
let userFactory = require('./user-factory.js');
let movieFactory = require('./fbMovieFactory.js');
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

//whether the user hits enter or clicks "submit" they run the search function
$('#userMessageInput').keyup( function (event) {
	if (event.which == '13' && $('#userMessageInput').val() !== "") {
		movieController.runSearchInAPI()
		.then(function(moviesSearched) {
			console.log("movies searched", moviesSearched);
			return movieFactory.getUserMovies();
		})
		.then(function(usersMovies) {
			console.log("users movies", usersMovies);
		});
		// movieController.runSearch()
		// .then ( (movieObjects) => {
		// 	console.log("movie objects", movieObjects);
		$('#userMessageInput').val("");
	}
});

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
	movieController.runSearch();
});

$('#filterUntracked').click( () => {
//function that makes sure no duplicates happen and print only API stuff to DOM
});

$('#filterWatchlist').click( () => {
//filter through the movies on the DOM and only print the ones on the watchlist (unwatched)
});


$('#filterWatched').click( () => {
	//filter through teh searched movies currently on the DOM and print only those with a rating of some kind
});

$('#filterFaves').click( () => {
//of movies on the DOM, print only those where rating >=9
});

//probably useless (below)
// function sortMoviesByWatched (unwatchedMoviesArray, watchedMoviesArray) {
// 	watchedMoviesArray = [];
// 	movieFactory.getUserMovies()//need to tie to search term of user, instead of print ALL user saved movies to DOM
// 	.then (function (data) {
// 		console.log("data?", data);
// 		$(data).each(function(index) {
// 			Object.keys(this).forEach(function(item) {
// 				if (data[item].watched) {
// 					console.log("item was watched", data[item]);
// 					watchedMoviesArray.push(data[item]);
// 				} else {
// 					console.log("unwatched stuff", data[item]);
// 					unwatchedMoviesArray.push(data[item]);
// 					return unwatchedMoviesArray;
// 				}
// 				console.log("unwatched movies", unwatchedMoviesArray);

// 			});
// 		});
// 	});
// }