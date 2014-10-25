/*
 * * Module dependencies
 * */

var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var nib = require('nib');


var app = express(); // sets up the server





app.set('views', __dirname + '/views') // sets dir

app.set('view engine', 'jade') // tells express to use jade

app.use(express.logger('dev'))


app.use(express.static(__dirname + '/public'))


app.get('/', function (req, res) {
  res.render('main',
      { title : 'Home' }
        )
})

console.log("now running");
app.listen(3000)
