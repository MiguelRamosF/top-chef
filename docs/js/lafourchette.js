var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');
var XMLHttpRequest = require('xhr2');
var request = require('requestretry'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry
var fs = require('fs');                //work with the file system 

var json_data = michelin.get();
var json_deal={ "deals": [] };
var json_name="deals.json";
var numberOfDeals = 0;

//Test : get all deals from all restaurants and store the deals in json
/*function get_names(){
	 var names=[];
	 json_data.restaurants.forEach(function(elem){
		 names.push(elem.name);
	 })
	 console.log(names);
}*/

function get_names(){
	 var names=[];
	 for(var i=0; i<json_data.restaurants.length;i++){
	 	 names.push(json_data.restaurants[i].name);
	 }
	 return names;
}
//get_names();
/*function init(){
	 var names_list = get_names();
	 var id_list = []
	 //var id_list = get_id(names_list);
	 for(var i=0;i<names_list.length;i++){
	 	 get_id(names_list[i],function(id){
	 	  	 id_list.push(id);
	 	  	 console.log(id_list.length);
	 	 });
	 }
	 
}*/
//END test

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

function count_deals(json_deal)
{
	deals_added==json_deal.deals.length;
}

//Async function, stores the deal in json
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
			//console.log(body);
			
			for(var i=0;i<json.length;i++){
    	 	 		 	 if(json[i].is_special_offer){
    	 	 		 	 	 var deal_title = json[i].title;
    	 	 		 	 	 var deal_description = json[i].description;
    	 	 		 	 	 var deal = {
				 		 	 "restaurant": restaurant,
				 			 "id_restaurant": id,
				 			 "deal_title": deal_title,
				 			 "deal_description": deal_description
							 };
    	 	 		 	 	 //json_deal.deals.push(deal);
    	 	 		 	 	 //console.log(json_deal);
    	 	 		 	 	 //numberOfDeals++;
    	 	 		 	 	 //console.log("number of deals:" + numberOfDeals);
    	 	 		 	 	 done(deal);
    	 	 		 	 	 //done(json_deal);
    	 	 		 	 }
    	 	 		 	 /*else{
    	 	 		 	 	 console.log("ce menu n'est pas un deal :"+json[i].title);
    	 	 		 	 }*/
    	 	 		 }
		}
	});
});
}

/*function count_deals(){
	numberOfDeals++;
}*/
//Async function, stores the deal in json

// Function add restaurant to json array and make a file from the json array
function make_Json(deal){
	json_deal.deals.push(deal);
	//console.log("json deals length" +json_deal.deals.length);
	//numberOfDeals++;

	//if(numberOfDeals==json_deal.deals.length){
	//console.log(json_deal.deals.length);
	fs.writeFile(json_name,JSON.stringify(json_deal),'utf-8',
		function(err){  //store the data 
          	 if(err) console.log("error with deal " + deal);
             else return console.log(json_deal.deals.length+" deals added to json file");
         });
}


function get_names(){
	var names = [];
	 for(var i=0; i<json_data.restaurants.length;i++){
	 	 names.push(json_data.restaurants[i].name);
	 }
	 return names;
}

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
//getDeal2("le chiberta");
//getDeal("le restaurant");
