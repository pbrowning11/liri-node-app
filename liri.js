var request = require("request");
require("dotenv").config();
var moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var input = process.argv[2];
var value = process.argv.slice(3).join("+");

if (input === "concert-this") {
    bandInfo(value);
} else if (input === "spotify-this-song") {
    songInfo(value);
} else if (input === "movie-this") {
    movieInfo(value);
} else if (input === "do-what-it-says") {
    userChoice();
};

function bandInfo(value) {

    request("https://rest.bandsintown.com/artists/" + value + "/events?app_id=28712c353ec64645faae102f822be11c", function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var Arr = JSON.parse(body);
            for (var i = 0; i < Arr.length; i++) {
                console.log(i+1 + ". The name of the venue is: " + Arr[i].venue.name);
                console.log("The location of the venue is: " + Arr[i].venue.city);
                console.log("The date of the show is: " + moment(Arr[i].datetime, "YYYY/MM/DD").format("MM/DD/YYYY"));
                console.log("---------------------");
            }
        }
    }
    )
};
function songInfo(value) {
    if (value === "") {
        value = "The Sign Ace of Base"
    }
    spotify.search({ type: 'track', query: value,}, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var itemsArr = data.tracks.items

        for (var i = 0; i < itemsArr .length; i++) {
        console.log(i+1 + " Artist: " + data.tracks.items[i].album.artists[0].name);
        console.log("Song Title: " + data.tracks.items[i].name);
        console.log("Spotify Preview: " + data.tracks.items[i].external_urls.spotify);
        console.log("Album Title: " + data.tracks.items[i].album.name);
        console.log("---------------------")
    }
    });
};
function movieInfo(value) {
    if (value === "") {
        value = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=ab3da6c4", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie's release year is: " + JSON.parse(body).Year);
            console.log("The movie's IMDb rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's Rotten Tomato rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie's production country is: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("The movie's actors are: " + JSON.parse(body).Actors);
        }
    });

};
function userChoice() {
    fs.readFile("random.txt", "utf-8", function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);
        inp = dataArr[0];
        val = dataArr[1];
        if (inp === "concert-this") {
            bandInfo(val);
        } else if (inp === "spotify-this-song") {
            songInfo(val);
        } else if (inp === "movie-this") {
            movieInfo(val);
        }
    })
}