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

// app.get('/', function(req, res){
//   res.render('index.ejs', {title: 'Clever Kitchens'});
// });

// app.get('/recipes', function(req, res){
//   res.render('layout.ejs', {
//     title: 'Clever Kitchens - Recipes', 
//     body: '<h1>All Recipes</h1>'
//   });
// });

// app.get('/recipes/:title', function(req, res) {
//  res.send('<h1>' + req.params.title + '</h1>');
// });

app.get('/*', function(req, res) {
  res.status(404).render('error.ejs', {title: 'Error'});
});

// app.listen(3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
