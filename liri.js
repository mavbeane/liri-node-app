//Global variables
var keys = require('./keys.js');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var command = process.argv[2];
var selection = process.argv[3];
var doubleCommand;

function liri() {

	switch (command) {
		case 'my-tweets': 
			// twitter keys from key.js
			var client = new Twitter({
				consumer_key: keys.twitterKeys.consumer_key,
				consumer_secret: keys.twitterKeys.consumer_secret,
				access_token_key: keys.twitterKeys.access_token_key,
				access_token_secret: keys.twitterKeys.access_token_secret
			});
			// log last 20 tweets from twitter
			var parameters = {screen_name: 'beane428'};
			client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
				if (!error) {
					console.log('YOUR TWEETS:');
					for (var i = 0; i < 20; i++){
						console.log(tweets[i].text);
						console.log('Created: ' + tweets[i].created_at);
						console.log('--------------------')
					};
				};
			});
			break;
		
		case 'spotify-this-song':
			//search spotify for track and log first result
			spotify.search({ type: 'track', query: selection }, function(err, data) {
			    if ( err ) {
			        console.log('Error occurred: ' + err);
			        return;
			    }
			    var songInfo = data.tracks.items[0];		 	
			    if (songInfo == undefined) {
					console.log('--------------------');
			    	console.log('I can\'t find your song! Here is info about an American classic! \nArtist: Ace of Base \nSong: The Sign \nAlbum: The Sign \nPreview link: https://p.scdn.co/mp3-preview/177e65fc2b8babeaf9266c0ad2a1cb1e18730ae4');
			    	console.log('--------------------');
			    } else {
			    	console.log('--------------------');
			    	console.log('REQUESTED SONG');
				    console.log('Artist: ' + songInfo.artists[0].name);
				    console.log('Song: ' + songInfo.name);
				    console.log('Preview link: ' + songInfo.preview_url);
				    console.log('Album: ' + songInfo.album.name);
				    console.log('--------------------');
			    };	   
			});
			break;

		case 'movie-this':
			// search omdb by title and log result movie info
			request('http://www.omdbapi.com/?&t=' + selection + '&type=movie&y=&plot=short&Tomatoes=true&r=json', function (error, response, body) {
				if (!error && response.statusCode == 200) {
				   	var movieInfo = JSON.parse(body);
				    if (movieInfo.Response == 'False') {
				    	console.log('Try your search again!');
				    } else if (selection == undefined) {
						console.log('--------------------');
						console.log('You didn\'t pick a movie!! \nIf you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/');
						console.log('It\'s on Netflix!');
						console.log('--------------------');
					} else {
						console.log(selection);
						console.log('--------------------');
				    	console.log('REQUESTED MOVIE')
					    console.log('Title: ' + movieInfo.Title);
					    console.log('Year: ' + movieInfo.Year);
					    console.log('IMDB Rating: ' + movieInfo.imdbRating);
					    console.log('Country: ' + movieInfo.Country);
					    console.log('Language: ' + movieInfo.Language);
					    console.log('Plot: ' + movieInfo.Plot);
					    console.log('Actors: ' + movieInfo.Actors);
					    console.log('Rotten Tomatoes Rating: ' + movieInfo.tomatoRating);
					    console.log('Rotten Tomatoes URL: ' + movieInfo.tomatoURL);
					    console.log('--------------------');
					};
				};
			});
			break;

		case 'do-what-it-says':
			// read file for commands, split and run initial function with new command + selection
			fs.readFile('random.txt', 'utf8', function(error, data) {
				var doubleCommand = (data).split(',');
				command = doubleCommand[0];
				selection = doubleCommand[1];
				liri();
			});
			break;
	};

};

liri();

function appendLog() {

	fs.appendFile('log.txt', newCommand, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('Content Added!');
		}
	});

};
