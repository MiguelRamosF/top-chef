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
function get_id(restaurant){
	var url = correct_url(restaurant.name);
	return new Promise((resolve, reject) => {
		request({
		url: url,
  		json: true, // The below parameters are specific to request-retry
  		maxAttempts: 10,   //  try 3 times
  	 	retryDelay: 10,  //  wait for 0.005s before trying again
  		retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  	},
  	function(err,resp,json){
  		if (err) return reject(err);//console.log("error at url : " + url + err);
  		else if(resp.statusCode==400) console.log("Bad REQUEST 400" + url)
  		else if(json.length!=0 && resp.statusCode == 200){

  			json.forEach(element=>{
  				if(element.address.postal_code==restaurant.zipcode){
    	 	 	 	var id = element.id;
    	 	 	 	return resolve(id);
    	 	 	}

  			})
    	}
    	else{
    	 	console.log("empty url : " + url);
    	}
    });
});
}

//Async function, get deal from the api url of lafourchette
function getDeal(restaurant,la_f_id){

		return new Promise((resolve, reject) => { 
		var urlDeal = "https://m.lafourchette.com/api/restaurant/"+la_f_id+"/sale-type";
		request({
			 url: urlDeal,
  			 json: true, // The below parameters are specific to request-retry
  		     maxAttempts: 10,   //  try 3 times
  	 		 retryDelay: 10,  //  wait for 0.005s before trying again
  		     retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  		 },
  		 function(err,resp,json){
  		 	if (err) return reject(err);//console.log("error at url : " + urlDeal);
  		 	else{
  		 		 //console.log(json);
  		 		 json.forEach(element=>{

  		 		 	if(element.is_special_offer){
              var deal_id = element.id;
  		 		 		var deal_title = element.title;
  		 		 		var deal_description = element.description;
  		 		 		var lafourchetteURL = "https://www.lafourchette.com/restaurant/"+restaurant.name+"/"+la_f_id;
  		 		 		var deal = {
                "id_deal" : deal_id,
  		 		 			"id_restaurant": la_f_id,
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
  		 		 		return resolve(deal);
  		 		 	}

  		 		 })	;
  		 		 //return resolve(deal);
  		 		 	
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
/*function display () {
    console.log("LOOOOOOOOOL");
}*/

//console.log(json_data);

var requests = json_data.restaurants.map(restaurant => get_id(restaurant).then(la_f_id=>{
	getDeal(restaurant,la_f_id)

}));

Promise.all(requests)
  .then(
                console.log("ok")
            )
  .catch(error => console.log(error));
	 



/*function getLafourchette (restaurant) {
  const configuration = {
    'uri': `https://lafourchette/searchRefine?${restaurant}`
  }

  return new Promise((resolve, reject) => {
    request(configuration, (err, response, body) => {
      if (err) {
        return reject(err);
      }

       // parse body

       const link = parse(body);

       return resolve(link);
    })
  });
}


getLafourchette('le courot')
  .then(result => console.log(result))
  .catch(err => console.error(err));

const restaurants = ['le courot', 'yannick aleno', ..., 'xxxxx'];
const requests = restaurants.map(restaurant => getLafourchette(restaurant));


Promise.all(requests)
  .then(function display (results) {
    console.log(results);
  })
  .catch(error => console.log(error));*/