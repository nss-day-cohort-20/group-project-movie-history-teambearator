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

fbFactory.giveMovieRating = (rating, movieId) => {
	return new Promise( (resolve, reject) => {
		let currentUser = firebase.auth().currentUser.uid;
		$.ajax({
			url: `${fbURL}/movies/${movieId}.json`,
			type: "PATCH",
			data: JSON.stringify()
		});
	});
};

fbFactory.markMovieAsWatched = (movieId) => {
	return new Promise( (resolve, reject) => {
		let currentUser = firebase.auth().currentUser.uid;
	});
};






module.exports = fbFactory;