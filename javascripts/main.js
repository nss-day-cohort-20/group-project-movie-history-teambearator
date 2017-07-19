'use strict';
let $ = require('jquery');
let movieController = require('./movie-controller.js');
let userFactory = require('./user-factory.js');
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



