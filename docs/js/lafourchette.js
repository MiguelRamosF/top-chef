var request = require('request');
var cheerio = require('cheerio');
var michelin = require('./michelin');
var XMLHttpRequest = require('xhr2');


var json_data = michelin.get();
var json_deal={ "deals": [] };

//Test : get all deals from all restaurants and store the deals in json
/*function get_names(){
	 var names=[];
	 json_data.restaurants.forEach(function(elem){
		 names.push(elem.name);
	 })
	 console.log(names);
}

function get_names(){
	 var names=[];
	 for(var i=0; i<json_data.restaurants.length;i++){
	 	 names.push(json_data.restaurants[i].name);
	 }
	 return names;
}
//get_names();
function init(){
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
	 	 id_url+=array[i]+"+";
	 }
	 return id_url;
}
//Async function, returns the id depending on the name
function get_id(name,done){
	 var xmlhttp = new XMLHttpRequest();
	 var url = correct_url(name);
	 //console.log(url);
	 xmlhttp.onreadystatechange = function() {
    	 if (this.readyState == 4 && this.status == 200) {
    	 	 //console.log(url);
    	 	 var json = JSON.parse(this.responseText);
    	 	 if(json.length!=0){
    	 	 	//console.log(json.length);
         	 	 var id = json[0].id;
         		 done(id);
         	 }
         	 else{
         		console.log("empty url : " + url);
         	 }
         }
	 };
	 xmlhttp.open("GET", url, true);
	 xmlhttp.send();
}

//Async function, stores the deal in json
function getDeal(restaurant){
	 //var json_deal={ "deals": [] };
	 var la_f_id=0;
	 get_id(restaurant,function(id){
		 la_f_id=id;
		 var urlDeal = "https://m.lafourchette.com/api/restaurant/"+id+"/sale-type";
		 var xmlhttp = new XMLHttpRequest();
	 	 //console.log(url);
	 	 xmlhttp.onreadystatechange = function() {
    		 if (this.readyState == 4 && this.status == 200) {
    	 	 	 //console.log(url);
    	 		 var json = JSON.parse(this.responseText);
    	 		 if(json.length!=0){
    	 	 		 for(var i=0;i<json.length;i++){
    	 	 		 	 if(json[i].is_special_offer){
    	 	 		 	 	 var title = json[i].title;
    	 	 		 	 	 var description = json[i].description;
    	 	 		 	 	 var deal = {
				 		 	 "restaurant": restaurant,
				 			 "id_restaurant": id,
				 			 "title": title,
				 			 "description": description
							 };
    	 	 		 	 	 json_deal.deals.push(deal);
    	 	 		 	 	 console.log(json_deal);
    	 	 		 	 	 //done(json_deal);
    	 	 		 	 }
    	 	 		 	 /*else{
    	 	 		 	 	 console.log("ce menu n'est pas un deal :"+json[i].title);
    	 	 		 	 }*/
    	 	 		 }
         		 }
         	 	 else{
         			 console.log("empty url : " + url);
         		 }
         	 }
		 };
		 xmlhttp.open("GET", urlDeal, true);
		 xmlhttp.send();
	 });
}



getDeal("le chiberta");
