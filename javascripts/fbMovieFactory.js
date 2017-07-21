'use strict';

let $ = require('jquery');
let fbURL = "https://moviehistoryteambearator.firebaseio.com";
let firebase = require('./fb-config');
let fbFactory = {};

fbFactory.getUserMovies = () => {
	return new Promise( (resolve, reject) => {
		let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies.json?orderBy="uid"&equalTo="${currentUser}"`
		}).done( (movieData) => {
			resolve(movieData);
		});
	});
};

//a helper function that adds firebase key as a property on object
function addIds (movieData) {
	var idArr = Object.keys(movieData);
	idArr.forEach ( (key) => {
		movieData[key].fbkey = key;
	});
	console.log("objects with fbkeys", movieData);
	return movieData;
}

//adds a movie with the user's ID attached as a property;
fbFactory.addMovie = (movieToBeAdded) => {
	return new Promise( (resolve, reject) => {
		let currentUser = firebase.auth().currentUser.uid;
		movieToBeAdded.uid = currentUser;
		$.ajax({
			url: `${fbURL}/movies.json`,
			type: "POST",
			data: JSON.stringify(movieToBeAdded),
			dataType: "json"
		}).done( (data) => {
			resolve(data);
		});
	});
};


// modifies the rating property on the movie object to the users input;
fbFactory.giveMovieRating = (rating, firebaseMovieKey) => {
	let movRating = {rating};
	return new Promise( (resolve, reject) => {
		// let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies/${firebaseMovieKey}.json`,
			type: "PATCH",
			data: JSON.stringify(movRating) //not sure if necessary;
		}).done( (data) => {
			resolve(data);
		});
	});
};

//modifies the watched property on the movie object to be true;
fbFactory.markMovieAsWatched = (firebaseMovieKey) => {
	let movWatched = {watched: true};
	return new Promise( (resolve, reject) => {
		// let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies/${firebaseMovieKey}.json`,
			type: "PATCH",
			data: JSON.stringify(movWatched) //not sure if necessary;
		}).done( (data) => {
			resolve(data);
		});
	});
};

//takes a movies unique ID, and removes from firebase;
fbFactory.deleteMovie = (movieId) => {
	if (movieId) {
		return new Promise( (resolve, reject) => {
			$.ajax({
				url: `${fbURL}/movies/${movieId}.json`,
				type: "DELETE"
			}).done( (data) => {
				resolve (data);
			});
		});
	} else {
		console.log("delete failed");
	}
};

// fbFactory.getFirebaseKeys = () => {
// let currentUser = firebase.auth().currentUser.uid;
// return new Promise( (resolve, reject) => {
// 	$.ajax({
// 		url: `${fbURL}/movies.json`
// 	}).done( (data) => {
// 		let usersMovies = [];
// 		data.filter(function(movie) {
// 			if (movie.uid === currentUser) {
// 				;
// 		})
// 		console.log(usersMovies);
// 		// let fbKeys = Object.keys(data);
// 	});
// 	//TODO: reject statement;
// });
// };

module.exports = fbFactory;