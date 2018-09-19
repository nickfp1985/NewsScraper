const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// scraping tools
// var axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

// var PORT = process.env.PORT || 3000;

// initialize Express
const app = express();

// MIDDLEWARE CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
// express.static to serve the public folder as a static directory
app.use(express.static("public"));

// if deployed, use the deployed db. Otherwise, use the local db
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ROUTE for scraping
app.get("/scrape", function(req, res) {
  // grab the body of the html with request
  axios.get("http://www.reuters.com/").then(function(response) {
    // load into cheerio and save it to a shorthand selector: $
    var $ = cheerio.load(response.data);

    // grab every h2 and do the following:
    $("article h2").each(function(i, element) {

      let result = {};

      // add text & href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // show the added Article on console
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

// ROUTE for getting all Articles from the db
app.get("/articles", function(req, res) {
  // grab every Article in the collection
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(MONGODB_URI, function() {
  console.log("App running on " + MONGODB_URI + "!");
});
