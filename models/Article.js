const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({

  headline: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// create model from Schema
let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
