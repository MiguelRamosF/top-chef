//var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');
var XMLHttpRequest = require('xhr2');
var request = require('requestretry'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry
var fs = require('fs');                //work with the file system 

var json_data = michelin.get();
var json_deals={ "deals": [] };
var json_name="deals.json";


//returns the url to get the restaurant id
function correct_url(name){
	var name_elements = name.split(' ');
	var name_url = "https://m.lafourchette.com/api/restaurant-prediction?name="
	 if(name_elements.length>2){      // We take only the first 2 elements for better research
	 	name_elements.length=2;
	 }
	 for(var i=0;i<name_elements.length;i++){
	 	if(name_elements[i]!="&"){

	 		name_url+=name_elements[i]+"+";
	 	}
	 }
	 name_url = name_url.replace(/[àáâãäåÀ]/g,'a');
	 name_url = name_url.replace(/[èéêëÉ]/g,'e');
	 name_url = name_url.replace(/[ìíîïÎ]/g,"i");
	 name_url = name_url.replace(/[òóôõöÔ]/g,"o");
	 name_url = name_url.replace(/[ùúûü]/g,"u");
	 name_url = name_url.replace(/[ç]/g,"c");


	 return name_url;
}

//Async function, returns the id depending on the name
function get_id(restaurant,done){
	var url = correct_url(restaurant.name);
	request({
		url: url,
  		json: true, // The below parameters are specific to request-retry
  		maxAttempts: 3,   //  try 3 times
  	 	retryDelay: 5,  //  wait for 0.005s before trying again
  		retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  	},
  	function(err,resp,json){
  		if (err) console.log("error at url : " + url + err);
  		else if(resp.statusCode==400) console.log("Bad REQUEST 400" + url)
  		else if(json.length!=0 && resp.statusCode == 200){
			for(var i=0;i<json.length;i++){
    	 	 	if(json[i].address.postal_code==restaurant.zipcode){
    	 	 	 	var id = json[i].id;
    	 	 	 	done(id);
    	 	 	}
    	 	 	 //else console.log("id not found in url :" + url);
    	 	}
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
  	 		 retryDelay: 5,  //  wait for 0.005s before trying again
  		     retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  		 },
  		 function(err,resp,json){
  		 	if (err) console.log("error at url : " + urlDeal);
  		 	else{
  		 		 //console.log(json);
  		 		for(var i=0;i<json.length;i++){
  		 		 	if(json[i].is_special_offer){
  		 		 		var deal_title = json[i].title;
  		 		 		var deal_description = json[i].description;
  		 		 		var lafourchetteURL = "https://www.lafourchette.com/restaurant/"+restaurant.name+"/"+id;
  		 		 		var deal = {
  		 		 			"id_restaurant": id,
  		 		 			"name": restaurant.name,
  		 		 			"address" : restaurant.address,
  		 		 			"zipcode" : restaurant.zipcode,
  		 		 			"chef" : restaurant.chef,
  		 		 			"city" : restaurant.city,
  		 		 			"stars" : restaurant.stars,
  		 		 			"deal_title": deal_title,
  		 		 			"deal_description": deal_description,
  		 		 			"lafourchetteURL" : lafourchetteURL
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
	json_deals.deals.push(deal);
	console.log(json_deals.deals.length+" deals added to json file");
	fs.writeFile(json_name,JSON.stringify(json_deals),'utf-8',
		function(err){  //store the data 
			if(err) console.log("error with deal : " + err);
			else console.log(json_deals.deals.length+" deals added to json file");
		});
}


//Getting all deals from lafourchette
function getAllDeals(){
	var json_deals={ "deals": [] };
	 for(var i=0; i<json_data.restaurants.length; i++)
	 {
	 	getDeal(json_data.restaurants[i], function(deal){
	 		make_Json(deal)
	 	});
	 }
}

getAllDeals();

