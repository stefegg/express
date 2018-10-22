var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var ObjectId = mongojs.ObjectId;
var db = mongojs('traversyapp', ['users'])
var app = express();

//ExpressValidator Middleware
app.use(expressValidator());

// var logger = function(req, res, next){
//   console.log('Logging...');
//   next();
// }
//
// app.use(logger);
//custom middleware

//global validationErrors

app.use(function(req, res, next){
  res.locals.errors = null;

  next();
})


//didnt have to do this - but this is helpful for establishing global variables in the future

//VIew Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static path
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res){
  db.users.find(function (err, docs) {
    res.render('index', {
      title: 'Customers',
      users: docs
    });
  })
});

app.post('/users/add', function(req, res){
req.checkBody('first_name', 'First Nameis Required').notEmpty();
req.checkBody('last_name', 'Last Nameis Required').notEmpty();
req.checkBody('email', 'Email Nameis Required').notEmpty();

var errors = req.validationErrors();

if(errors){
  res.render('index', {
    title: 'Customers',
    users: users,
    errors: errors
  });
} else {
  var newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  }
  db.users.insert(newUser, function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
}
});

app.delete('/users/delete/:id', function(req, res){
  db.users.remove({_id: ObjectId(req.params.id)},function(err, result){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, function(){
  console.log('server started on port 3000');
});
