require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", function (req, res, next) {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
    //   console.log(`Data: ${data.body.artists.items}${res.json(data.body.artists.items)}`);
      res.render('artist-search-results', {artist: data.body.artists.items});
    console.log("")
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistID", (req,res)=>{
    spotifyApi
    .getArtistAlbums(req.params.artistID)
    .then(data =>{
        // console.log("The album data", data.body.items)
        res.render("albums",{albums: data.body.items})
    })
    .catch((err)=>{
        console.log("The albums error:", err)
    })
})
app.get("/tracks/:albumID", (req,res)=>{
    spotifyApi
    .getAlbumTracks(req.params.albumID)
    .then(data =>{
        // console.log("The track data", data.body.items)
        res.render("tracks",{tracks: data.body.items})
    })
    .catch((err)=>{
        console.log("The albums error:", err)
    })
})



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
