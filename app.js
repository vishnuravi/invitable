/*
 * * Module dependencies
 * */

var config = require('./config/development');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var nib = require('nib');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var app = express(); // sets up the server

mongoose.connect(config.db);;

app.set('views', __dirname + '/views') // sets dir

// deactivate jade -- app.set('view engine', 'jade')

app.use(express.logger('dev'))

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting up passport authentication
require('./passport')(passport)
app.use(session({ secret: 'invitable invitables'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./routes/routes')(app, passport);

app.use(express.static(__dirname + '/public'))

console.log("invitable is now running");
app.listen(3000)
