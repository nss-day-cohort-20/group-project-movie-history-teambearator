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

$('#messageSubmitButton').click ( function () {
	movieController.runSearch();
});

