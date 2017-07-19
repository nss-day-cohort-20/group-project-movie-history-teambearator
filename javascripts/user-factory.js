'use strict';

let firebase= require("./fb-config");
let provider = new firebase.auth.GoogleAuthProvider();

module.exports.logInGoogle = () =>{
	console.log ("hiya! auth");
	return firebase.auth().signInWithPopup(provider);
	//argument of auth provider you're using
};//results of calling method on firebase object

module.exports.logOutGoogle = ()=>{
	console.log ("logout");

	firebase.auth().signOut().then(function() {
 		// alert("Thanks for visiting us!");
 	location.reload();
}).catch(function(error) {
 		// alert("Something went wrong.");
});


};