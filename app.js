var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');


var mongo = require('mongo');
var mongoose = require('mongoose');
var mongoUri = "mongodb://heroku_app35895981:uouj39lc2h4qlphv8e2n8jes58@ds031892.mongolab.com:31892/heroku_app35895981";
//var mongoUri = mongoUri.formatMongoose(url);
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function(error){
	console.log(error);
});
db.on('open', function(){
	console.log('SUCCESS! Connected to Mongo');
});

var qText, qLoc, qYes, qNo, qComm; 

// QUESTION COLLECTION
var questionSchema = mongoose.Schema({
  text: String,
  location: String,
  yes: Number,
  no: Number, 
  comments: Number  
});

var Question = mongoose.model('questions', questionSchema); // questions doesn't matter, just collection name in mongo

// COMMENT COLLECTION
var commentSchema = mongoose.Schema({
  q_id: String,
  comment: String
});

var Comment = mongoose.model('comments', commentSchema);

// USER COLLECTION
var userSchema = mongoose.Schema({

});

var User = mongoose.model('users', userSchema);




// var app = express.createServer();
var app = express();
app.use(bodyParser.urlencoded({

}));


app.set('port', process.env.PORT || 3000);

//***************** QUESTION STUFF ***************************//

app.get('/questions', function(req, res){
//    var questions = [
//      {id: 1, title: 'What is up?'},
//      {id: 2, title: 'Is it fun?'},
//      {id: 3, title: 'Hello'}
//    ];
//    res.send(questions);

   Question.find({}, 'text yes no comments', function(err, questions){
      if(err) return handleError(err);
      res.send(questions);
   });

});

app.get('/single-question', function(req, res){
//    var questions = [
//      {id: 1, title: 'What is up?'},
//      {id: 2, title: 'Is it fun?'},
//      {id: 3, title: 'Hello'}
//    ];
//    res.send(questions);

   Question.find({'_id':req.query.id}, 'text yes no comments', function(err, question){
      if(err) return handleError(err);
      res.send(question);
   });

});

app.post('/new-question', function(req, res){
  qText = req.body.text;
  qLoc = req.body.location;
  qYes = req.body.yes;
  qNo = req.body.no;
  qComm = req.body.comments;
  
  var q = new Question({
    text: qText,
    location: qLoc,
    yes: qYes,
    no: qNo,
    comments: qComm
  });

  q.save(function(err){
    console.log(err);
    res.send(q);
  });
});

//***************** COMMENT STUFF ***************************//

// add new comment
app.post('/single-question/new-comment', function(req, res){
  nComm = req.body.comment;
  nQID = req.body.q_id;
  
  var c = new Comment({
    comment: nComm,
    q_id: nQID,
  });

  // get question, find the comments.
  // comments + 1
  Question.find({'_id':nQID}, 'comments', function(err, question){
    if(err) return handleError(err);

    Question.update(
      { '_id': nQID }, 
      { 'comments':  question.comments + 1},
      function (err, numAffected) {}
    );
      
   });

      
  c.save(function(err){
    console.log(err);
    res.send(c);
  });
});

// get all comments for a question
app.get('/single-question/comments', function(req, res){

   Comment.find({'q_id': req.query.q_id}, 'comment', function(err, comments){
      if(err) return handleError(err);
      res.send(comments);
   });

});


app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

// app.listen(3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
