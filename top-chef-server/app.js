var request = require('requestretry'); //When the connection fails with one of ETIMEDOUT the request will automatically be re-attempted as these are often recoverable errors and will go away on retry


var url1="https://jsonplaceholder.typicode.com/users";
var url2="https://jsonplaceholder.typicode.com/users";

var json_users={ "users": [] };
function getUsers(j,url,callback){
	console.log("j = " + j)
	 request({
  				 url: url,
  			 	 json: true, // The below parameters are specific to request-retry
  				 maxAttempts: 3,   //  try 3 times
  	 		  	 retryDelay: 10,  //  wait for 0.005s before trying again
  		 		 retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
			},
	function(err,resp,body){
		if (err) console.log("error at url : " + url);
		else{

			for(var i=0;i<body.length;i++){
				var user = {
				"id": body[i].id,
				"name": body[i].name,
				"username": body[i].username,
				"email": body[i].email
				}
				json_users.users.push(user);
			}
			callback(j,json_users);
		}
	});
}

function getPosts(url,callback){
	 request({
  				 url: url,
  			 	 json: true, // The below parameters are specific to request-retry
  				 maxAttempts: 3,   //  try 3 times
  	 		  	 retryDelay: 10,  //  wait for 0.005s before trying again
  		 		 retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
			},
	function(err,resp,body){
		if (err) console.log("error at url : " + url);
		else callback(body);
	});
}

function make_Json(deal){
	json_deal.deals.push(deal);
	fs.writeFile(json_name,JSON.stringify(json_deal),'utf-8',
		function(err){  //store the data 
          	 if(err) console.log("error with deal " + deal);
             else return console.log(json_deal.deals.length+" deals added to json file");
         });
}


function finished (j,response1,done){

	if( j == 3)
	{
		done(response1)
	}
}
function getAll(){
	for (var j=0; j<4;j++){
		getUsers(j,url1,function (j,response1){
			console.log("coucou" +j);

			finished(j,response1,function(response2){
				console.log(response2);

			})
			
		/*getPosts(url2,function(response2){
			console.log(response1)
			console.log(response2)
		})*/
	})
		console.log(j);
	}
	
}

getAll()