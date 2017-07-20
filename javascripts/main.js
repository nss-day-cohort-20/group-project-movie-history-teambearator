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
	if (event.which == '13') {
		movieController.runSearch()
		.then ( (movieObjects) => {
			console.log("movie objects", movieObjects);
		});
	}
});

$(document).on("click", '.watchlist', function() {

	console.log("click is working");
	let movieId = $(this).parent().parent().attr('id');
	console.log("movieId", movieId);
	let movieMatch = movieController.selectedMovies;
		console.log("selected movies?", movieMatch);
		for(var i = 0; i < movieMatch.length; i++) {
			if(movieMatch[i].id == movieId) {
				movieFactory.addMovie(movieMatch[i]);
				// .then( function(movieObjj){
				// 	console.log("movieObjj", movieObjj);
				// });
			}
			console.log("movieMatch", movieMatch[i], movieMatch[i].id);
		}
		// movieMatch.forEach(function(movie) {
		// 	console.log(movie);
		// 	let selectedMovie = movie.id.includes(movieId);
		// 	console.log("selected", selectedMovie, movie);
		// });
		// movieMatch.filter( function(movie) {
		// 	console.log(movie);
		// 	let selectedMovie = movie.id.includes(movieId);
		// 	console.log(selectedMovie);
		// 	movieFactory.addMovie(selectedMovie[0]);
		// });
});

$('#messageSubmitButton').click ( function () {
	movieController.runSearch();
});

