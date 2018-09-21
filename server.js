const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");

const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARE CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
// express.static to serve the public folder as a static directory
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/dbArticle", { useNewUrlParser: true });

// // if deployed, use the deployed db. Otherwise, use the local db
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/dbArticle";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ROUTE for scraping
app.get("/scrape", function(req, res) {
  // grab the body of the html with request
  request("https://www.reuters.com/news/world", function(error, response, html) {
    // load into cheerio and save it to a shorthand selector: $
    let $ = cheerio.load(html);

    $(".FeedPage_item-list").each(function(i, element) {

      let result = {};

      result.title = $(this).find(".FeedItemHeadline_headline.FeedItemHeadline_full").text().trim();
      result.summary = $(this).find(".FeedItemLede_lede").text().trim();
      result.link = $(this).find("a").attr("href");

      // create a new Article using the `result` object
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

app.listen(PORT, function() {
  console.log("App running on " + PORT + "!");
});
