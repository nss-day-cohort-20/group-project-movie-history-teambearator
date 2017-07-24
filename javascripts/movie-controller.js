'use strict';

let $ = require('jquery');
let movieController= {};
let newSearch = require('./apiMovieFactory');
let actorUrl = "https://api.themoviedb.org/3/movie/";
let moviedbData = require("./api-getter")();
let movieFactory = require('./fbMovieFactory');
let templateBuilder = require('./template-builder');

// search based on keyword/s entered by user
movieController.runSearchInAPI = () => {
	let userInput = $("#userMessageInput").val();
	return new Promise (function (resolve, reject) {
		newSearch.getMovies(userInput)
		.then ( function (data) {
			let apiMovieResults = data.results;
			//limit to ten movies if requests get cut off - replace apiMovieResults
			// let tenNewMovies = data.results.slice(0, 10);//slice off first 10 results
			// console.log("ten movies", tenNewMovies);
			// let castPromisesArray = buildCastPromises(tenNewMovies);//go through movies,grab id, get actor info
			let castPromisesArray = buildCastPromises(apiMovieResults);//go through movies,grab id, get actor info
			Promise.all(castPromisesArray) //array of promises --data below is castPromises resolved, which isthe actor list for each movie
			.then(function(data) {
				console.log("object of objects with arrays of cast members", data);
				resolve(addActors(apiMovieResults, data));
				//resolve(variable for the next function in the promise string) the result of addActors
			});
		});
	});
	// }
};

function buildCastPromises (movieArray) {
	let movieIdArray = movieArray.map(function (item) {
		return item.id; //ten movie ids
	});
	let castPromises = [];
	movieIdArray.forEach( (item) => {
		let url = `${actorUrl}${item}/credits?api_key=${moviedbData.api_key}`;//this url goes into getCastDetails Movie factory
		castPromises.push(newSearch.getCastDetails(url));
		//result of getCastDetails goes into castPromises array -- castPromises is now an array of promises
	});

	console.log("movieIdArray", movieIdArray);
	return castPromises;
}

function addActors (movies, actors) {
	//pass in data from resolved promise.all
	let castArrays = [];
	//iteratethrough movies using index
	movies.forEach(function(movie, index) {
		let tenMovieCasts= actors[index].cast; //get whole casts for all ten movies
		//sliceoff the first 3 cast members for each movie
		let shortCasts = tenMovieCasts.slice(0,3);
		let shortCastsStrings = shortCasts.map((castObj)=>{
			return castObj.name;
		});//just get the strings from the objects
		castArrays.push(shortCastsStrings); //add shortCasts to cast arrays
	});
	//buildMovieObjects with movies and cast arrays
	return buildMovieObjects(movies, castArrays);
}

//build the object that gets templateified -- need the actors
function buildMovieObjects (arrayOfMovies, castArrays) {
	// console.log("array of movies", arrayOfMovies);
	for (let i=0; i<arrayOfMovies.length; i++) {
		arrayOfMovies[i].actors = castArrays[i];
	}//for each movie, give the shortcast,and make it a property on the object called actors
	let movieArrayThing = arrayOfMovies;
	//store movieArrayThing as exportable from module - available until next search
	movieController.selectedMovies = movieArrayThing;
	// return array of movie objects with new property on each object, so we can fill templates
	// templateBuilder.printMovieList(arrayOfMovies);
	return arrayOfMovies;
}

// adds user info to API results before sending on to DOM template;
movieController.addUserInfoAndPrint = (usersMovieArr, apiMovieArr) => {
	apiMovieArr.forEach( (movie) => {
		for (var i=0; i < usersMovieArr.length; i++) {
			if ( movie.id === usersMovieArr[i].id ) {
				movie.uid = usersMovieArr[i].uid;
				movie.rating = usersMovieArr[i].rating;
			}
		}
	});
	//format date to year only
	apiMovieArr.forEach((movie, index)=>{
		apiMovieArr[index].release_date = movie.release_date.slice(0,4);
	});
	// console.log('apiMovieArr', apiMovieArr);
	//send complete info to template
	templateBuilder.printMovieList(apiMovieArr);
};

function userMoviesSearched(allUserMovies, string) {
	return new Promise(function(resolve, reject) {
		let newArr = allUserMovies.filter(function(object) {
			//match user movies to search keywords (string)
			return object.title.match(new RegExp(string, 'i'));
		});
		resolve(newArr);
	});
}

//helper for printUserMoviesToDom - grabs all movie info, including cast
function buildMovieDetailsAndCastPromises (movieArray) {
	let movieIdArray = movieArray.map(function (item) {
		return item.id;
	});
	// make array of promises for each movieID from newSearch.getMovieDetailsWithCast
	let detailsWithCastPromiseArr = [];
	movieIdArray.forEach( (item) => {
		detailsWithCastPromiseArr.push(newSearch.getMovieDetailsWithCast(item));
	});
	// console.log("detailsWithCastPromiseArr", detailsWithCastPromiseArr);
	return detailsWithCastPromiseArr;
}

//runs on login to show all user movies
movieController.printUserMoviesToDom = function() {
	//grab user's movies from FB
	movieFactory.getUserMovies()
	.then( (userMovies) => {
		//push to array for later use
		let userMovieArr = [];
		for (var movie in userMovies) {
			userMovieArr.push(userMovies[movie]);
		}
		// pass array to function that creates promise to grab movie info from API
		let promiseArr = buildMovieDetailsAndCastPromises(userMovieArr);
		Promise.all(promiseArr)
		.then( (apiResults) => {
			//add relevant api results to each user movie
			userMovieArr.forEach( (movie, index) => {
				movie.title = apiResults[index].title;
				movie.poster_path = apiResults[index].poster_path;
				movie.release_date = apiResults[index].release_date.slice(0,4);
				movie.actors = [];
				//must check if each cast slot exists in result before adding to movie, or promise will fail
				if ( apiResults[index].credits.cast[0].name ) {
					movie.actors[0] = apiResults[index].credits.cast[0].name;
				}
				if ( apiResults[index].credits.cast[1].name ) {
					movie.actors[1] = apiResults[index].credits.cast[1].name;
				}
				if ( apiResults[index].credits.cast[2].name ) {
					movie.actors[2] = apiResults[index].credits.cast[2].name;
				}
			});
			// send movies, now with all info, to DOM template
			templateBuilder.printMovieList(userMovieArr);
		});
	});
};

module.exports = movieController;