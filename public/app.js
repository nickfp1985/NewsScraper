// grab Articles as json
$.getJSON("/articles", function(data) {
  for (let i = 0; i < data.length; i++) {
    // display Article info
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + 
    "<br />" + data[i].summary + "<br />" + data[i].link + "</p>");
  }
});

// whenever someone clicks a <p> section
$(document).on("click", "p", function() {
  // empty the comments
  $("#comments").empty();
  // save the id from the p tag
  let thisId = $(this).attr("data-id");

  // ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // add the comment to the page
    .then(function(data) {
      console.log(data);
      // title of article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // input for a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // textarea to add a new comment body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // if there's a comment on the article
      if (data.comment) {
        // comment title put into title input
        $("#titleinput").val(data.comment.title);
        // comment body put into the body textarea
        $("#bodyinput").val(data.comment.body);
      }
    });
});

$(document).on("click", "#savecomment", function() {
  // grab the article id from the submit button
  let thisId = $(this).attr("data-id");

  // POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      // empty the comments
      $("#comments").empty();
    });

  // remove values entered in the input and textarea for the comments
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
