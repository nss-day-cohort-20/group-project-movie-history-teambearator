'use strict';

let $ = require('jquery');
let firebase= require("./fb-config");
let provider = new firebase.auth.GoogleAuthProvider();
let movieController = require('./movie-controller');

let logInGoogle = () => {
	return firebase.auth().signInWithPopup(provider);
	//argument of auth provider you're using
};//results of calling method on firebase object

let logOutGoogle = ()=>{
	console.log ("logout");

	firebase.auth().signOut().then(function() {
 		alert("Thanks for visiting us!");
 	location.reload();
}).catch(function(error) {
 		console.log("error:",error );
	});
};

$(document).on('click','#login', function() {
	// console.log("login");
	logInGoogle()
	//wrapped in promises automatically
	.then((result)=>{
		let user = result.user.uid;
		console.log("user", user);
		movieController.printUserMoviesToDom();
 		// movieController.loadMoviesToDom();
 		$('.after-login-page').toggleClass('isHidden');
 		$('.login-page').toggleClass('isHidden');
	});
});
//user can log out by clicking logout button and page refreshes
$("#logout").click(function(){
	logOutGoogle();
});