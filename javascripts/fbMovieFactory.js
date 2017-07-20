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

fbFactory.giveMovieRating = (rating, movieObj) => {
	movieObj.rating = rating;
	return new Promise( (resolve, reject) => {
		// let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies/${movieObj}.json`,
			type: "PATCH",
			data: JSON.stringify(movieObj) //not sure if necessary;
		}).done( (data) => {
			resolve(data);
		});
	});
};

fbFactory.markMovieAsWatched = (movieObj) => {
	movieObj.watched = true;
	return new Promise( (resolve, reject) => {
		// let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies/${movieObj}.json`,
			type: "PATCH",
			data: JSON.stringify(movieObj) //not sure if necessary;
		}).done( (data) => {
			resolve(data);
		});
	});
};

//takes a movie object, and removes from firebase;
fbFactory.deleteMovie = (movieObj) => {
	if (movieObj) {
		return new Promise( (resolve, reject) => {
			// let currentUser = firebase.auth().currentUser.uid;
			$.ajax({
				url: `${fbURL}/movies/${movieObj}.json`,
				type: "DELETE"
			}).done( (data) => {
				resolve (data);
			});
		});
	} else {
		console.log("delete failed");
	}

};

module.exports = fbFactory;