'use strict';

let $ = require('jquery');
let movieFactoryAPI = require('./apiMovieFactory.js');
let movieController = require('./movie-controller.js');

//whether the user hits enter or clicks "submit" they run the search function
$('#userMessageInput').keyup( function (event) {
	if (event.which == '13') {
		movieController.runSearch();
	}
});

$('#messageSubmitButton').click ( function () {
	movieController.runSearch();
});
