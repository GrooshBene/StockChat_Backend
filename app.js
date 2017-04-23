var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var schema = mongoose.Schema();

var UserSchema = new schema({
  _id : String,
    name : String,
    id : String,
    password : String,
    email : String,
    mail_service : Boolean,
    favorite : [{
      type : String,
        ref : 'stock'
    }],
    scrap : [{
      type : String,
        ref : 'article'
    }],
    register_day : String,
    current_login : String,
    point : Number
});

var StockSchema = new schema({
  _id : String,
    code : String,
    name : String,
    current_val : String,
    yesterday_val : String,
    diff_percentage : String
});

var ArticleSchema = new schema({
    _id : String,
    title : String,
    date : String,
    content : String,
    views : Number,
    recommend : Number,
    writer : String
});

var MessengerSchema = new schema({
  _id : String,
    sender : String,
    recipient : String,
    date : String,
    content : String
});

mongoose.connect("mongodb://localhost:27017/stockchat", function (err) {
    if(err){
      console.log("MongoDB Error");
      throw err;
    }
});

var User = mongoose.model('users', UserSchema);
var Stock = mongoose.model('stock', StockSchema);
var Article = mongoose.model('article', ArticleSchema);
var Message = mongoose.model('message', MessengerSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
