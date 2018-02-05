var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');

michelin.restaurantsScraper( function(data) {
   console.log('data from scraper received');
   setTimeout(function() {
   	console.log(data);
   }, 5000);
   
 })