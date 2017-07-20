'use strict';

let $ = require('jquery');

let movieListTemplate = require('../templates/movieCard.hbs');

let templateBuilder = Object.create(null);

templateBuilder.printMovieList =(movieArray)=>{
	let $container = $('#message-creator');
	$container.html(movieListTemplate(movieArray));
	//need data to fill in template
};





module.exports= templateBuilder;