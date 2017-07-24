'use strict';

let $ = require('jquery');
let movieController = require('./movie-controller.js');
let movieFactory = require('./fbMovieFactory.js');
let templateBuilder = require('./template-builder.js');
let user = require('./user-factory.js');

//search is run on input enter keypress
$('#userMessageInput').keyup( function (event) {
	//check for empty value on enter press
	if (event.which == '13' && $('#userMessageInput').val() !== "") {
		//empty breadcrumb area
		$("#breadcrumbs").html("");
		//run search API promise, store results
		let moviesSearchedFromAPI;
		movieController.runSearchInAPI()
		.then(function(moviesSearched) {
			moviesSearchedFromAPI = moviesSearched;
			//get FB user movies
			return movieFactory.getUserMovies();
		})
		.then(function(usersMovies) {
			let arrayifiedUsersMovies = Object.values(usersMovies);
			//send to arrays to movie controller
			movieController.addUserInfoAndPrint(arrayifiedUsersMovies, moviesSearchedFromAPI);
		});
	}
});

function buildObj(movieMatch) {
	let movieObj = {};
	movieObj.id = movieMatch.id;
	movieObj.rating = 0;
	return movieObj;
}

//add watchlist button sends to FB, updates rating custom data attr
$(document).on("click", '.watchlist', function() {
	let movieId = $(this).parent().parent().attr('id');
	$(this).parent().parent().data('rating', 0);
	let movieMatch = movieController.selectedMovies;
	for(var i = 0; i < movieMatch.length; i++) {
		if(movieMatch[i].id == movieId) {
			let movieObj =  buildObj(movieMatch[i]);
			movieFactory.addMovie(movieObj);
			// console.log(movieObj, "movieObj");
		}
	}
	let dataRating = $(this).parent().parent().data('rating');
	let starsAndDeleteBtnElement = templateBuilder.makeStarsAndDelete(dataRating, movieId);
	$(this).parent().append(starsAndDeleteBtnElement);
	$(this).remove();
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

//rating listener
$(document).on("click", ".rating", function() {
	console.log(event.target.id, "event.target.id");
	let starId = event.target.id;
	for(let i=1; i <= starId; i++) {
		$(`#${i}`).addClass('ratedStar');
	}
	let movieId = $(this).parent().parent().attr('id');
	$(this).parent().parent().data('rating', starId);
	console.log("movieId", movieId);
	movieFactory.getUniqueIds(movieId)
	.then( function(uniqueId) {
		movieFactory.giveMovieRating(starId, uniqueId);
	});
});

//FILTER LISTENERS
function showUntracked() {
	$('.card').each( function() {
		$(this).removeClass('isHidden');
		if ( $(this).data('rating') >= 0) {
			$(this).addClass('isHidden');
		}
	});
}

$('#untracked').click( function() {
	$("#breadcrumbs").html("Untracked");
	showUntracked();
});

function showUnwatched() {
	$('.card').each( function() {
		$(this).addClass('isHidden');
		if ( $(this).data('rating') == 0 ) {
			$(this).removeClass('isHidden');
		}
	});
}

$('#unwatched').click( function() {
	$("#breadcrumbs").html("Unwatched");
	showUnwatched();
});

function showWatched() {
		$('.card').each( function() {
		$(this).addClass('isHidden');
		if ( parseInt($(this).data('rating')) > 0 ) {
			let rate = $(this).data('rating');
			for(let i=1; i<=rate; i++) {
				$(this).find(`#${i}`).addClass('ratedStar');
			}
			$(this).removeClass('isHidden');
		}
	});
}

$('#watched').click( function() {
	$("#breadcrumbs").html("Watched");
	showWatched();
});

function showFavorites() {
	$('.card').each( function() {
		$(this).addClass('isHidden');
		if ( $(this).data('rating') > 8 ) {
			let rate = $(this).data('rating');
			for(let i=1; i<=rate; i++) {
				$(this).find(`#${i}`).addClass('ratedStar');
			}
			$(this).removeClass('isHidden');
		}
	});
}

$('#favorites').click( function() {
	$("#breadcrumbs").html("Favorites");
	showFavorites();
});

$(document).on("click", ".rating", function() {
	console.log(event.target.id, "event.target.id");
	let starId = event.target.id;
	let movieId = $(this).parent().parent().attr('id');
	// $(this).parent().parent().data('rating', starId);
	$(this).parent().parent().attr('data-rating', starId);

	$(this).remove();
	movieFactory.getUniqueIds(movieId)
	.then( function(uniqueId) {
		movieFactory.giveMovieRating(starId, uniqueId);
	});
	// let newRating = $(this).parent().parent().data('rating');
	let newStarsDiv = templateBuilder.makeStarsDiv({rating:starId});
	$(`#${movieId}`).find('.card-block').append(newStarsDiv);

});

