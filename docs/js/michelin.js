var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var json = { "restaurants": [] };
var starter_url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin";

//Scrape information on the restaurant url
function getRestaurant(url,callback){
  request(url, function(err,resp,html){
    const $=cheerio.load(html);
    var name = $('h1').first().text();
    var address = $('.thoroughfare').first().text();
    var zipcode = $('.postal-code').first().text();
    var city = $('.locality').first().text();
    var chef = $('.field--name-field-chef').children('.field__items').text();
    var restaurant = {
      "name": name,
      "address": address,
      "zipcode": zipcode,
      "city": city,
      "chef": chef
    };
  callback(restaurant); //Once the process is done, we catch the restaurant info
  });
}

//Scrape all the restaurants urls on every page url (as parameter)
function scrapeUrls(url,callback){
  var urls_restaurant=[];

  request(url, function(err,resp,body){  
    var $=cheerio.load(body);
    $('.poi-card-link').each(function(){
      var url_temp = "https://restaurant.michelin.fr";
      url_temp+=$(this).attr('href');

      urls_restaurant.push(url_temp);              //Every restaurant name is added to the array of restaurants
      });
  callback(urls_restaurant);     //Once the process is done, we catch the restaurant urls
  });
}

//Determine the number of pages to scrape based on the first page url
function nbPagestoScrape(url,callback){
var urls_pages=[];
  request(url, function(err,resp,body){  
    var $=cheerio.load(body);
    $('.mr-pager-link').each(function(){
      var url_temp=$(this).attr('attr-page-number');
      urls_pages.push(Number(url_temp));            //Page numbers are added to the array urls_pages
    });
  var nbPages=Math.max(...urls_pages); //the maximum number of page dertermine number of pages to scrape
  callback(nbPages);                   //Once the process is done, we catch the number of pages to scrape
  });
}

//Scrape restaurants using callbacks functions to handle data
function Scrape(url){
  nbPagestoScrape(url,function(nbPages){
    for(var i=1; i<=nbPages; i++){
      var nextUrl = url+"/page-"+String(i);
      scrapeUrls(nextUrl,function(urls_restaurant){
        urls_restaurant.forEach(function (ur){
          getRestaurant(ur,function(restaurant){
            json.restaurants.push(restaurant);
            //store the data 
            fs.writeFile('restaurants.json',JSON.stringify(json),'utf-8',function(err){
              if(err) return console.log(err);
              else return console.log("json progressing...");
              });
            console.log(json);
          }) 
        })
      });
    }
  });
}

Scrape(starter_url);

