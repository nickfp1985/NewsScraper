const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CommentSchema = new Schema({
  title: String,
  body: String
});

// create model from Schema
let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
