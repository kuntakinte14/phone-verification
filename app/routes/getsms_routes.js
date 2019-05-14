// routes/getsms_routes.js
var moment = require('moment');
var qs = require('querystring');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	const collection =

	app.get('/usdo.php', (req,res) => {
		console.log("/usdo.php requested using a get");
	});
		
	app.post('/usdo.php', (req, res) => {	
		console.log("/usdo.php requested using a post");
		//console.log(req.body);
		//var str = req.url.split('?')[1];
		//var urlParams = qs.parse(str);
		//console.log(urlParams.username);		
	    //const token = urlParams.token;
	    //const username = urlParams.username;
	    const token = req.body.token;
	    const username = req.body.username;	    
	    // Security Check
	    if (username == "pvacreator" && token == "6pGja1ntkO4IHrwsBrzd") {
	    	//const action = urlParams.action;
	    	const action = req.body.action;
	    	var response;
	    	if (action == "getmobile") {
	    		console.log("in getmobile action processing");
	    		//const pid = urlParams.pid;
	    		
	            var phoneArray = ["2062351348",
	                              "2062355779",
	                              "2062356796",
	                              "2062357593",
	                              "2062359088",
	                              "2062398140"];
		    	//var randomItem = phoneArray[Math.floor(Math.random()*phoneArray.length)];
		    	var randomItem = "6285027003";
		    	response = randomItem;
		    	console.log("mobile number requested, returned the following: "+randomItem);
		    	res.send(response);
	    	}
	    	else if (action == "getsms") {
	    		console.log("in getsms action processing");
	    		//const pid = urlParams.pid;
	    		//const mobile = urlParams.mobile;
	    		const pid = req.body.pid;
	    		const mobile = req.body.mobile;	    		
	    		
			    var short_code;
			    if (pid == "1") {
			    	// gmail
			    	short_code = "22000";
			    }
			    else if (pid == "2") {
			    	// yahoo
			    	short_code = "36742";
			    }
			    else if (pid == "3") {
			    	// aol
			    	short_code = "36742";
			    }
			    else if (pid == "4") {
			    	// o365
			    	short_code = "732873";
			    }

			    //const filter = { 'receiver': mobile, 'sender': short_code, 'code_used': false };
			    const filter = { 'receiver': mobile, 'pid': pid, 'code_used': false };
			    const update = { $set: { code_used: true, updated_on_timestamp: moment.utc().format() } };
			    db.collection('phoneinfo').find(filter).sort({_id:-1}).limit(1).toArray (function (err, result) {
				      if (err) {
				    	  console.log("an error occurred in the findOne");
				    	  //res.send({'error':'An error has occurred'});
				    	  response = "{'error':'An error has occurred'}";
				    	  res.send(response);
				      } else {
		                  console.log(result);
		                  for (var i in result) {
		                        console.log(result[i].verification_code);
		                        var item = result[i];
		                  }
		                  //var item = JSON.parse(result[0]);
				    	  //res.contentType('application/json');
				    	  if (item != null ) {
				    		  console.log("the findOne was successful");
				    		  console.log("returned code: "+item.verification_code);
				    		  //console.log(item);
				    		  //var obj = {"phone verification code": item.verification_code};
				    		  response = pid+"|"+item.message;
				    		  res.send(response);
				    		  /*db.collection('phoneinfo').update(filter,update, (err, item) => {
				    		      if (err) {
				    		    	  //res.send({'error':'An error has occurred'});
				    		    	  console.log("an error occurred in the update")
				    		      } else {
				    		    	  console.log("the update was successful");
				    		      }
				    		  });*/
				    	  }
				    	  else {
		                      console.log("the findOne did not return a row for the following values: mobile number - "+mobile+", pid - "+pid);
		                      //var obj = {"error": "No verification code available. You probably need to use the phone number for verification prior to calling this API!"};
		                      response = "{'error':'An error has occurred'}";
		                      res.send(response);
				    	  }		    	  
				    	  //res.send(JSON.stringify(obj));
				      }
			    });
	    		
	    	   		
	    		//var response = "1|[SMS Content]";
	    		//res.send(response);
	    	}
	    	//res.send(response);
	    }
	});
};		