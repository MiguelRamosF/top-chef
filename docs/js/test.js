var request = require('request'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry

var url1 = "https://m.lafourchette.com/api/restaurant-prediction?name=Le+B%C3%A9naton+"
var url2 = "https://m.lafourchette.com/api/restaurant-prediction?name=Le+Benaton+"

function getPosts(url){
	 request(url,/*{
  				 url: url,
  			 	 json: true, // The below parameters are specific to request-retry
  				 maxAttempts: 3,   //  try 3 times
  	 		  	 retryDelay: 10,  //  wait for 0.005s before trying again
  		 		 retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
			},*/
	function(err,resp,body){
		if (err) console.log("error at url : " + url);
		else {
			console.log(body)
		}
	});
}

getPosts(url2);
var string = "Bénàton"
string = string.replace(/[àáâãäå]/g,'a');
string = string.replace(/[èéêë]/g,'e');
string = string.replace(/[ìíîï]/g,"i");
string = string.replace(/[òóôõö]/g,"o");
string = string.replace(/[ùúûü]/g,"u");


console.log(string)

console.log(encodeURIComponent('?x=шеллы'));
