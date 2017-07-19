'use strict';

let $ = require('jquery');

let movieListTemplate = require('../templates/movieCard.hbs');

let templateBuilder = Object.create(null);

templateBuilder.makeMovieList =(movieList)=>{
	return movieListTemplate();
	//need data to fill in template
};

//add to this once we're done with more of the search



module.exports= templateBuilder;