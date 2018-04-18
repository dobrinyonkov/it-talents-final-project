var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//database configuration
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://heroku_nf9l5q4b:2618qlen71ent4qhgcpug2522a@ds247619.mlab.com:47619/heroku_nf9l5q4b');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var postsRouter = require('./routes/posts');
var addPostRouter=require('./routes/addPost');
var app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//vkarava mu bazata
app.use(function (req, res, next) {
  req.db = db;
  next();
})
//da sa vijda dali bachka
app.use("/",indexRouter)
//users
app.use('/api/users', usersRouter);
app.use('/login', loginRouter);
//posts
app.use('/api/posts', postsRouter);
//add post test page
app.use('/addPost', addPostRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
