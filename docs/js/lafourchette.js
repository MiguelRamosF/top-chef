var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');
var XMLHttpRequest = require('xhr2');
var request = require('requestretry'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry
var fs = require('fs');                //work with the file system 

var json_data = michelin.get();
var json_deal={ "deals": [] };
var json_name="deals.json";

//Test : get all deals from all restaurants and store the deals in json

//Function to create an array of restaurants names from michelin.js
function get_names(){
	 var names=[];
	 for(var i=0; i<json_data.restaurants.length;i++){
	 	 names.push(json_data.restaurants[i].name);
	 }
	 return names;
}

//returns the url to get the restaurant id
function correct_url(name){
	 var array = name.split(' ');
	 var id_url = "https://m.lafourchette.com/api/restaurant-prediction?name="
	 for(var i=0;i<array.length;i++){
	 	if(array[i]!="&"){

	 	 	 id_url+=array[i]+"+";
	 	}
	 }
	 return id_url;
}
//Async function, returns the id depending on the name
function get_id(name,done){
	 var url = correct_url(name);
	 request({
  				 url: url,
  			 	 json: true, // The below parameters are specific to request-retry
  				 maxAttempts: 3,   //  try 3 times
  	 		  	 retryDelay: 10,  //  wait for 0.005s before trying again
  		 		 retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
			},
	function(err,resp,json){
		if (err) console.log("error at url : " + url);
		else if(json.length!=0){
    	 	 	 /*for(var i=0;i<json.length;i++){
    	 	 	 	 if(json[i].adsress)
    	 	 	 }*/
    	 	 	 //console.log(url);
         	 	 var id = json[0].id;
         		 done(id);
         	 }
         	 else{
         		console.log("empty url : " + url);
         	 }
	});
}


//Async function, get deal from the api url of lafourchette
function getDeal(restaurant,done){
	var la_f_id=0;
	get_id(restaurant,function(id){
		 la_f_id=id;
		 var urlDeal = "https://m.lafourchette.com/api/restaurant/"+id+"/sale-type";

		 request({
			 url: urlDeal,
  			 json: true, // The below parameters are specific to request-retry
  		     maxAttempts: 3,   //  try 3 times
  	 		 retryDelay: 10,  //  wait for 0.005s before trying again
  		     retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  		 },
  		 	function(err,resp,json){
  		 		 if (err) console.log("error at url : " + urlDeal);
  		 		 else{
  		 		     for(var i=0;i<json.length;i++){
  		 				 if(json[i].is_special_offer){
  		 					 var deal_title = json[i].title;
  		 					 var deal_description = json[i].description;
  		 					 var deal = {
  		 			    		 "name": restaurant,
  		 						 "id_restaurant": id,
  		 						 "deal_title": deal_title,
  		 						 "deal_description": deal_description
  		 					 };
  		 					 done(deal);
  		 				 }

  		 			 }
  		 		 }
  		     }
  		 );
	});
}

// Function add deal to json array and make a file from the json array
function make_Json(deal){
	json_deal.deals.push(deal);
	fs.writeFile(json_name,JSON.stringify(json_deal),'utf-8',
		function(err){  //store the data 
          	 if(err) console.log("error with deal " + deal);
             else return console.log(json_deal.deals.length+" deals added to json file");
         });
}


//Getting all deals from lafourchette
function getAllDeals(){
	 var restaurant_names = get_names()
	 for(var i=0; i<restaurant_names.length; i++)
	 {
	 	 getDeal(restaurant_names[i], function(deal){
	 	 	 make_Json(deal);
	 	 });
	 }

}

getAllDeals();

