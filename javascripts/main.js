'use strict';

let $ = require('jquery');
let movieFactoryAPI = require('./apiMovieFactory.js');
let movieController = require('./movie-controller.js');
let movieFactory = require('./fbMovieFactory.js');
let templateBuilder = require('./template-builder.js');
//let apiGetter = require('./api-config.js');
//event listeners

$(".login-page > div:gt(0)").hide();

setInterval(function() { 
$('.login-page > div:first')
.fadeOut(0)
.next()
.fadeIn(1000)
.end()
.appendTo('.login-page');
},  3000);

//ERROR ERROR ERROR!!!!
//whether the user hits enter or clicks "submit" they run the search function
$('#userMessageInput').keyup( function (event) {
	if (event.which == '13' && $('#userMessageInput').val() !== "") {
		let moviesSearchedFromAPI;
		movieController.runSearchInAPI()
		.then(function(moviesSearched) {
			moviesSearchedFromAPI = moviesSearched;
			return movieFactory.getUserMovies();
		})
		.then(function(usersMovies) {
			let arrayifiedUsersMovies = Object.values(usersMovies);
			movieController.filterOutUserMovies(arrayifiedUsersMovies, moviesSearchedFromAPI);
		});
		// movieController.runSearch()
		// .then ( (movieObjects) => {
		// 	console.log("movie objects", movieObjects);
		// $('#userMessageInput').val("");
	}
});
function buildObj(movieMatch)
{
	let movieObj = {};
	movieObj.id = movieMatch.id;
	movieObj.title = movieMatch.title;
	movieObj.actors = [];
	movieMatch.actors.forEach( (actor) =>
	{
		movieObj.actors.push(actor.name);
	});
	movieObj.tracked = true;
	movieObj.rating = 0;
	movieObj.uid = movieMatch.uid;
	movieObj.year = movieMatch.release_date.slice(0,4);
	movieObj.poster_path = movieMatch.poster_path;	
	return movieObj;
}

//add watchlist button adds
$(document).on("click", '.watchlist', function() {
	let movieId = $(this).parent().parent().attr('id');
	let movieMatch = movieController.selectedMovies;
	for(var i = 0; i < movieMatch.length; i++) {
		if(movieMatch[i].id == movieId) {
			let movieObj =  buildObj(movieMatch[i]);
			movieFactory.addMovie(movieObj);
			// console.log(movieObj, "movieObj");
		}
	}
});

//delete button
$(document).on('click', '.delete' ,function() {
	// console.log("event.target",event.target);
	let id = event.target.id.slice(7);
	console.log("id-delete",id );
	$(`#${id}`).remove(); //remove from screen
	movieFactory.getUniqueIds(id)
	.then( (uniqueId) => {
		movieFactory.deleteMovie(uniqueId);
	});
});

