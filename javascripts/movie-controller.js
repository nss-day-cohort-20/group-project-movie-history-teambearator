'use strict';

let $ = require('jquery');
let movieController= {};
let newSearch = require('./apiMovieFactory');
let actorUrl = "https://api.themoviedb.org/3/movie/";
let moviedbData = require("./api-getter")();
let movieFactory = require('./fbMovieFactory');
let templateBuilder = require('./template-builder');


//
movieController.runSearchInAPI = () => {
	let userInput = $("#userMessageInput").val();
	return new Promise (function (resolve, reject) {
		newSearch.getMovies(userInput)
		.then ( function (data) {
			let tenNewMovies = data.results.slice(0, 10);//slice off first 10 results
			console.log("ten movies", tenNewMovies);
			let castPromisesArray = buildCastPromises(tenNewMovies);//go through movies,grab id, get actor info
			Promise.all(castPromisesArray) //array of promises --data below is castPromises resolved, which isthe actor list for each movie
			.then(function(data) {
				console.log("object of objects with arrays of cast members", data);
				resolve(addActors(tenNewMovies, data));
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
	movies.forEach(function(movie, index) {
		//iteratethrough movies using index
		// console.log('each actor object?', actors[index]);
		let tenMovieCasts= actors[index].cast; //get whole casts for all ten movies
		let shortCasts = tenMovieCasts.slice(0,3);
		//sliceoff the first 3 cast members for each movie
		// console.log('shortcasts array?', shortCasts);
		let shortCastsStrings = shortCasts.map((castObj)=>{
			return castObj.name;
		});//just get the strings from the objects
		// console.log('shortCastsStrings ?', shortCastsStrings);
		castArrays.push(shortCastsStrings); //add shortCasts to cast arrays
	});
		// console.log("cast arrays", castArrays);
		//buildMovieObjects with movies and cast arrays
		return buildMovieObjects(movies, castArrays);
}

//build the object that gets templateified -- need the actors
function buildMovieObjects (arrayOfMovies, castArrays) {
	console.log("array of movies", arrayOfMovies);
	for (let i=0; i<arrayOfMovies.length; i++) {
		arrayOfMovies[i].actors = castArrays[i];
	}//for each movie, give the shortcast,and make it a property on the object called actors
	// console.log("movie objects", arrayOfMovies);
	let movieArrayThing = arrayOfMovies;
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
	templateBuilder.printMovieList(apiMovieArr);
};

function userMoviesSearched(allUserMovies, string) {
	return new Promise(function(resolve, reject) {

		let newArr = allUserMovies.filter(function(object) {
			// console.log("object.title",object.title );
			return object.title.match(new RegExp(string, 'i'));
		});
		// console.log("newArr",newArr);
		resolve(newArr);
	});
}

// module.exports.showSavedMovies = () => {
// 	console.log('showSavedMovies fn');
// 	fbFactory.getUserMovies()
// 	.then( (userMovieData) => {
// 		console.log('userMovieData', userMovieData);
// 		module.exports.savedFBToMovieCards(userMovieData);
// 	})
// 	.catch( (error) => {
// 		console.log('error', error);
// 	});
// };

function buildMovieDetailsAndCastPromises (movieArray) {
	let movieIdArray = movieArray.map(function (item) {
		return item.id; //ten movie ids
	});
	let detailsWithCastPromiseArr = [];
	movieIdArray.forEach( (item) => {
		// let url = `${actorUrl}${item}/credits?api_key=${moviedbData.api_key}`;//this url goes into getCastDetails Movie factory
		detailsWithCastPromiseArr.push(newSearch.getMovieDetailsWithCast(item));
		//result of getCastDetails goes into detailsWithCastPromiseArr array -- detailsWithCastPromiseArr is now an array of promises
	});
	console.log("detailsWithCastPromiseArr", detailsWithCastPromiseArr);
	return detailsWithCastPromiseArr;
}

movieController.printUserMoviesToDom = function() {
		movieFactory.getUserMovies()
		.then( (userMovies) => {
			// console.log('userMovies', userMovies);
			let userMovieArr = [];
			for (var movie in userMovies) {
				userMovieArr.push(userMovies[movie]);
			}
			console.log('userMovieArr', userMovieArr);
			let promiseArr = buildMovieDetailsAndCastPromises(userMovieArr);
			console.log('promiseArr', promiseArr);

			Promise.all(promiseArr)
			.then( (movieArr) => {
				// console.log(movieArr);
				userMovieArr.forEach( (movie, index) => {
					movie.title = movieArr[index].title;
					console.log('userMovieArr[movie]', userMovieArr[movie]);
				});

				// dataFromMovieSearchApi.results.forEach((movie, index) => {
				// 	dataFromMovieSearchApi.results[index].actors = actorsArrays[index];
				// });
				// // console.log('modified search results', dataFromMovieSearchApi);
				// resolve(dataFromMovieSearchApi);
			});
		});
};

module.exports = movieController;