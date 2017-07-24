'use strict';

let $ = require('jquery');
let Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('rating-helper', function(rating, currentStar){
	console.log("rating",rating );
	// console.log("currentStar",currentStar );
	if (rating >= currentStar) {
		return 'ratedStar';
	} else {
		return '';
	}
});

let movieListTemplate = require('../templates/movieCard.hbs');
let starsAndDeleteTemplate = require('../templates/starsAndDeleteBtn.hbs');
let starsTemplate = require('../templates/stars.hbs');

let templateBuilder = Object.create(null);

templateBuilder.printMovieList =(movieArray)=>{
	let $container = $('#message-creator');
	$container.html(movieListTemplate(movieArray));
	//need data to fill in template
};
templateBuilder.makeStarsAndDelete = (rating, movieId) => {
	let starsElement = starsAndDeleteTemplate(rating, movieId);
	return starsElement;
};

templateBuilder.makeStarsDiv = (rating) => {
	console.log('rating in makeStarsDiv', rating);
	let starsElement = starsTemplate(rating);
	return starsElement;
};

module.exports= templateBuilder;