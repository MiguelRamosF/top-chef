//var request = require('request');
var request = require('requestretry'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry
var cheerio = require('cheerio');      //Fast, flexible & lean implementation of core jQuery designed specifically for the server
var fs = require('fs');                //work with the file system

var json = { "restaurants": [] };
var starter_url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin";
var count_resto_urls = 0;           //Limit for async function
var urls_restaurant=[];             //Contains the ursl of all the stared restaurants
var json_name="restaurants.json";
var i = 0;

//Determine the number of pages to scrape based on the first page url
function getNbPagestoScrape(url,done){
	var urls_pages=[];
  	request(url, function(err,resp,body){ 
  		 if (err) console.log("error at url : " + url);
  		 else{
  		 	 var $=cheerio.load(body);
    		 $('.mr-pager-link').each(function(){
      		 	 var url_temp=$(this).attr('attr-page-number');
      	  		 urls_pages.push(Number(url_temp));            //Page numbers are added to the array urls_pages
    		 });
  		 	 var nbPages=Math.max(...urls_pages); //the maximum number of page dertermine number of pages to scrape
  			 //next();
  			 done(null,nbPages);                   //Once the process is done, we catch the number of pages to scrape
  		 } 
 	 });
}

//Determine the number of restaurants to scrape based on the results of the starter_url (615 - 05/02/2018)
function getNbRestaurants(url,done){
  	request(url, function(err,resp,body){ 
  		 if (err) console.log("error at url : " + url);
  		 else{
  		 	 var $=cheerio.load(body);
    		 var nbRestaurants = $('#invoke-search').val();
    		 nbRestaurants = nbRestaurants.replace(/\D/g,'');
  			 done(null,nbRestaurants);                   //Once the process is done, we catch the number of restaurants
  		 } 
 	 });
}

//Scrape all the restaurants urls on every page url (as parameter)
function scrapeUrls(url,done){
	 //var urls_restaurant=[];
  	 request(url, function(err,resp,body){  
  	 	 if (err) console.log("error at url : " + url);
  	 	 else{
  	 	 	 var $=cheerio.load(body);
    		 $('.poi-card-link').each(function(){
      		 	 var url_temp = "https://restaurant.michelin.fr";
      			  url_temp+=$(this).attr('href');
      		 	 urls_restaurant.push(url_temp);              //Every restaurant name is added to the array of restaurants
      		 });
      		 urls_Limit(urls_restaurant);
  			 done(null,urls_restaurant);     //Once the process is done, we catch the restaurant urls
  	 	 }
  		
  	});
}

//Function which helps to wait for the async function scrapeUrls to finish
function urls_Limit(urls_restaurant){
	count_resto_urls=urls_restaurant.length;
	//console.log(count_resto_urls);
}

function getStars(){

}

/*function count_i() //Debug
{
	i++;
	console.log(i);
}*/
//var chefs =[];
//Scrape information on the restaurant url
function getRestaurant(url,done){
	request({
  				 url: url,
  			 	 json: true, // The below parameters are specific to request-retry
  				 maxAttempts: 10,   //  try 3 times
  	 		  	 retryDelay: 10,  //  wait for 0.005s before trying again
  		 		 retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
			},
	function(err,resp,html){
		if (err) console.log("error at url : " + url);
		else{
			//count_i();
			const $=cheerio.load(html);
			var name = $('h1').first().text();
			var stars = $('.michelin-poi-distinctions-list').text().charAt(0);
			var address = $('.thoroughfare').first().text();
			var zipcode = $('.postal-code').first().text();
			var city = $('.locality').first().text();
			var chef = $('.field--name-field-chef').children('.field__items').first().text();
			/*if(chef != ""){
				chefs.push(chef); //Count number of chefs
			}
			console.log("CHEFS LENGTH /:" + chefs.length);*/
			var restaurant = {
				 "name": name,
				 "address": address,
				 "zipcode": zipcode,
				 "city": city,
				 "chef": chef,
				 "stars": stars
			};

			make_Json(restaurant);
  			done(null,restaurant); //Once the process is done, we catch the restaurant info
		}
	});
}

// Function add restaurant to json array and make a file from the json array
function make_Json(restaurant){
	json.restaurants.push(restaurant);
	console.log(json.restaurants.length);
	//if(json.restaurants.length==count_resto_urls){
		fs.writeFile(json_name,JSON.stringify(json),'utf-8',
		function(err){  //store the data 
          	 if(err) console.log("error with restaurant " + restaurant);
             else return console.log(json.restaurants.length+" restaurants added to json file");
         });
	//}
}


//Main function
function scrapeAllRestaurants(url){
	 getNbPagestoScrape(url,function(err,nbPages){
	 	getNbRestaurants(starter_url,function (err,nbRestaurants){
	 	 	for(var i=1; i<=nbPages; i++){ //starts at page-1
	 	 		var newPageUrl=url+"/page-"+String(i);
	 	 	 	scrapeUrls(newPageUrl,function(err,urls_restaurant){
	 	 	 		 if(count_resto_urls==nbRestaurants){                   //help the async function scrapeUrls to finish, otherwise we don't have all the urls to continue the getrestaurant()
	 	 	 	 		 urls_restaurant.forEach(function(url_resto){
	 	 	 	 	 		 getRestaurant(url_resto,function(err,restaurant){
	 	 	 	 	 		 	//console.log(restaurant);
	 	 	 	 	 	 	})
	 	 	 	 	 	})
	 	 	 		 }
	 	 	 	})
	   	 	 }
	   	 })
	 })
}

//scrapeAllRestaurants(starter_url);


//Get the restaurants from the json file (sync function)
function get() {
 	 var json = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));
 	 return json;
}

module.exports.get = get; 