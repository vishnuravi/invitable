/*
 * * Module dependencies
 * */

var config = require('./config/development');

var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var nib = require('nib');
var invitable=require('./routes/invitableRoute.js');

var app = express(); // sets up the server
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose   = require('mongoose');
mongoose.connect(config.db);


app.set('views', __dirname + '/views') // sets dir

app.set('view engine', 'jade') // tells express to use jade

app.use(express.logger('dev'))


app.use(express.static(__dirname + '/public'))

app.post('/invitables', invitable.create)

app.get('/', function (req, res) {
  res.render('main',
      { title : 'Home' }
        )
})

console.log("now running");
app.listen(3000)
