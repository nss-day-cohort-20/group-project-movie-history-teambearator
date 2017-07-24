'use strict';

let $ = require('jquery');
let movieFactoryAPI = require('./apiMovieFactory.js');
let movieController = require('./movie-controller.js');
let movieFactory = require('./fbMovieFactory.js');
let templateBuilder = require('./template-builder.js');
let user = require('./user-factory.js');
//let apiGetter = require('./api-config.js');
//event listeners

//whether the user hits enter or clicks "submit" they run the search function
$('#userMessageInput').keyup( function (event) {
	$("#breadcrumbs").html("");
	if (event.which == '13' && $('#userMessageInput').val() !== "") {
		let moviesSearchedFromAPI;
		movieController.runSearchInAPI()
		.then(function(moviesSearched) {
			moviesSearchedFromAPI = moviesSearched;
			return movieFactory.getUserMovies();
		})
		.then(function(usersMovies) {
			let arrayifiedUsersMovies = Object.values(usersMovies);
			movieController.addUserInfoAndPrint(arrayifiedUsersMovies, moviesSearchedFromAPI);
			if($('#message-creator').children().data('rating'))
			{
			console.log($(this));
			}
		});
	}

});

function buildObj(movieMatch)
{
	let movieObj = {};
	movieObj.id = movieMatch.id;
	movieObj.rating = 0;
	return movieObj;
}

//add watchlist button adds
$(document).on("click", '.watchlist', function() {
	let movieId = $(this).parent().parent().attr('id');
	$(this).parent().parent().attr('data-rating', 0);
	let movieMatch = movieController.selectedMovies;
	for(var i = 0; i < movieMatch.length; i++) {
		if(movieMatch[i].id == movieId) {
			let movieObj =  buildObj(movieMatch[i]);
			movieFactory.addMovie(movieObj);
			// console.log(movieObj, "movieObj");
		}
	}
	let dataRating = $(this).parent().parent().data('rating');
	let starsElement = templateBuilder.makeStarsDiv(dataRating, movieId);
	$(this).parent().append(starsElement);
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



$('#untracked').click( function() {
	$("#breadcrumbs").html("Untracked");
	$('.card').each( function() {
		$(this).removeClass('isHidden');
		if ( $(this).data('rating') >= 0) {
			$(this).addClass('isHidden');
		}
	});
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
	for(let i=1; i<=10; i++)
		$(`#${i}`).removeClass('ratedStar');
	for(let i=1; i <= starId; i++)
	{
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