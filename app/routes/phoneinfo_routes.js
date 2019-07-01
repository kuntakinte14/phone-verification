// routes/phoneinfo_routes.js
var moment = require('moment');
var qs = require('querystring');
var ObjectID = require('mongodb').ObjectID;

const getDomain = require('./utils/findDomain');

module.exports = function(app, db) {
	const collection = 
		
	app.get('/test', (req, res) => {
		var testString = "testing moving findDomain logic into a module";
		var returnedValue = getDomain(testString);
		res.send(returnedValue);
		console.log(returnedValue);
	});

    ////////////////////////////////////////////////////////////////////////////
	//
	// ACTIVE: This processes the sms forwarding message sent from the ejoin 
	// sms gateway when an incoming message is received by that server
	//
	app.post('/ejoin', (req, res) => {
		console.log("ejoin sms gateway sms message forwarded:");
		//console.log(req.body);
		var responseString="";
		req.on("data", function (data) {
	        // save all the data from response			
	        responseString += data;
	    });
	    req.on("end", function () {
	        //var messageJSON = JSON.parse(responseString);
	    	////////////////////////////////////////////////////////////////////
	    	//
	    	// use this variable definition for live production as the ejoin
	    	// gateway returns a carriage return line feed between each line of
	    	// the forwarded message.
	    	//
	    	////////////////////////////////////////////////////////////////////
	        var messageArray = responseString.split("\r\n");
	        ////////////////////////////////////////////////////////////////////
	        //
	        // this line is used for testing using postman which cannot be
	        // configured to return a carriage return + line feed, only a line
	        // feed between each line of the forwarded message.
	        //
	        // If you uncomment the below line, make sure to comment out the
	        // above line, and vice versa.
	        //
	        ////////////////////////////////////////////////////////////////////
	    	//var messageArray = responseString.split("\n");
	        
	        var messageValues = [];
		    for (i = 0; i < messageArray.length; i++) { 
		    	////////////////////////////////////////////////////////////////
		    	//
		    	// Assign "sender" value
		    	//
		    	////////////////////////////////////////////////////////////////
		    	if (messageArray[i].includes("Sender")) {
		    		curValueArray = messageArray[i].split(": ");
		    		if (curValueArray[1].startsWith("00")) {
		    			curValueArray[1] = curValueArray[1].slice(2);
		    		}
		    		else if (curValueArray[1].startsWith("0")) {
		    			curValueArray[1] = curValueArray[1].slice(1);		    			
		    		}
		    		//console.log("final sender value: "+ curValueArray[1]);
		    		messageValues["sender"] = curValueArray[1];
		    	}
		    	////////////////////////////////////////////////////////////////
		    	//
		    	// Assign "port" and "receiver" values
		    	//
		    	////////////////////////////////////////////////////////////////
                else if (messageArray[i].includes("Receiver")) {
                    //console.log(messageArray[i]);
                    curValueArray = messageArray[i].split(": ");
                    //console.log(curValueArray[0]+" - "+ curValueArray[1]);
                    curPropsArray = curValueArray[1].split(" ");
                    //console.log(curPropsArray[0]+" - "+curPropsArray[1]);
                    messageValues["port"] = curPropsArray[0];
                    messageValues["receiver"] = curPropsArray[1];
                    //senderArray = curValueArray;
                    //console.log(messageValues);                           
                }
		    	////////////////////////////////////////////////////////////////
		    	//
		    	// Assign "smsc" value
		    	//
		    	////////////////////////////////////////////////////////////////
		    	else if (messageArray[i].includes("SMSC")) {
		    		curValueArray = messageArray[i].split(": ");
		    		if (curValueArray[1].startsWith("00")) {
		    			curValueArray[1] = curValueArray[1].slice(2);
		    		}
		    		else if (curValueArray[1].startsWith("0")) {
		    			curValueArray[1] = curValueArray[1].slice(1);		    			
		    		}
		    		//console.log("final smsc value: "+ curValueArray[1]);		    		
		    		messageValues["smsc"] = curValueArray[1];
		    	}
		    	////////////////////////////////////////////////////////////////
		    	//
		    	// Assign "scts" value
		    	//
		    	////////////////////////////////////////////////////////////////
		    	else if (messageArray[i].includes("SCTS")) {
		    		curValueArray = messageArray[i].split(": ");
		    		messageValues["scts"] = curValueArray[1];
		    	}
		    	////////////////////////////////////////////////////////////////
		    	//
		    	// Assign "code", "message", and "pid" values
		    	//
		    	////////////////////////////////////////////////////////////////
		    	else if (messageArray[i] !== null && messageArray[i] !== '') {
		    		messageParams = messageArray[i].split(" ");
		    		//console.log(messageParams);
		    		var code;
		    		var fullMessage = messageArray[i];
		    		//var pid = "0"; // change this to call a method that returns the pid
		    		var pid = getDomain(fullMessage);
		    		
		    		////////////////////////////////////////////////////////////
		    		// Try and Assign pid - move this code into a module to centralize
		    		// all the logic for procesing the long list of domains we need to
		    		// support
		    		if (fullMessage.indexOf("AOL") != -1) {
		    			//console.log("is this aol? YES");
		    			pid = "3";
		    		}
		    		else if (fullMessage.indexOf("Yahoo") != -1) {                                                                                                                                                       
                        pid = "2";
		    		}
		    		else if (fullMessage.indexOf("G-") != -1) {                                                                                                                                                          
                        pid = "1";
		    		}
		    		else if (fullMessage.indexOf("Office") != -1) {                                                                                                                                                      
                        pid = "4";
		    		}	
		    		////////////////////////////////////////////////////////////
		    		
		    		////////////////////////////////////////////////////////////
		    		// Extract code - move this to a module to clean up this code.
		    		// this is only really needed if we use our pva endpoints with
		    		// pvacreator rather than the getsms endpoints. Also, all the
		    		// services will most likely be returning / forwarding the
		    		// full message
		    		for (j=0; j<messageParams.length; j++) { 
		    			//console.log(messageParams[j]);
		    			if (isNaN(messageParams[j])) {
		    				//console.log("this is text, check for gmail");
		    				if (messageParams[j].indexOf("G-") == 0) {
		    					//console.log("this is gmail verification");
		    					code = messageParams[j].slice(2);
		    					pid = "1";
		    				}
		    			}
		    			else {
		    				if (messageParams[j] != "365") {
		    				    code = messageParams[j];
		    				    //console.log("code is: "+code);
		    				}
		    			}
		    		}		
		    		////////////////////////////////////////////////////////////
		    		
		    		//console.log("full message: "+ messageArray[i]);
		    		messageValues["code"] = code;
		    		messageValues["message"] = fullMessage;
		    		messageValues["pid"] = pid;
		    		//console.log("full message: "+ messageValues["message"]);
		    	}
		    }
		    ////////////////////////////////////////////////////////////////////
		    //
		    // Construct the phone array and use it to insert the data into the
		    // phoneinfo collections
			const phone = { 
					smsc: messageValues["smsc"], 
					sender: messageValues["sender"], 
					message: messageValues["message"], 
					receiver: messageValues["receiver"], 
					port: messageValues["port"],
					verification_code: messageValues["code"],
					pid: messageValues["pid"],
					message_timestamp: messageValues["scts"],
					created_on_timestamp: moment.utc().format(), 
					created_on_date: moment.utc().format("MM-DD-YYYY"),
					code_used: false,
					first_name: '', 
					last_name: '', 
					email_address: '', 
					phone_number: '',
					company_name: '',
					user_id: '',
					domain_name: '',
					password: '',
					challenge_code: '',
					updated_on_timestamp: ''			
			};
			db.collection('phoneinfo').insert(phone, (err, result) => {
				if (err) { 
			        res.send({ 'error': 'An error has occurred' }); 
				} else {
                    console.log(result.ops[0]);
                    //res.send(result.ops[0]);
                    res.sendStatus(200);
				}
			});	 
			////////////////////////////////////////////////////////////////////
	    });		
		//res.send("sms forwarded message received!");
	});		
		
	////////////////////////////////////////////////////////////////////////////
	//
	// Return a number based on the provided pid
	//
	// Example Call: http://149.28.244.189:8000/phoneinfo/username/{username}
	// /token/{token}/pid/{pid}
	//
	app.get('/phoneinfo/username/:username/token/:token/pid/:pid', (req, res) => {
		const pid = req.params.pid;
	    const token = req.params.token;
	    const username = req.params.username;
	    if (username == "pvacreator" && token == "6pGja1ntkO4IHrwsBrzd") {
            var phoneArray = ["2062351348",
                              "2062355779",
                              "2062356796",
                              "2062357593",
                              "2062359088",
                              "2062398140"];
	    	//var randomItem = phoneArray[Math.floor(Math.random()*phoneArray.length)];
	    	var randomItem = "6285027003";
	    	
	    	res.contentType('application/json');
		    var obj = {"phone number": randomItem};
		    console.log("mobile number requested, returned the following: "+randomItem);
		    res.send(JSON.stringify(obj));	    	
	    }
	    
	    /*
	    const details = { 'host_number': host_number, 'created_on_date': creation_date };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	  
	    */
	});	
	
	////////////////////////////////////////////////////////////////////////////
	//
	// Blacklist a mobile number based on the provided number and pid
	//
	// Example Call: http://149.28.244.189:8000/phoneinfo/username/{username}
	// /token/{token}/pid/{pid}/mobile/{mobile}
	//
	app.put('/phoneinfo/username/:username/token/:token/pid/:pid/mobile/:mobile', (req, res) => {
		const mobile = req.params.mobile;
		const pid = req.params.pid;
	    const token = req.params.token;
	    const username = req.params.username;
	    if (username == "pvacreator" && token == "6pGja1ntkO4IHrwsBrzd") {
	    	/*var phoneArray = ["14153108543",
	    	                  "17025674325",
	    	                  "12056453426",
	    	                  "14805462376",
	    	                  "14794575654"];
	    	var randomItem = phoneArray[Math.floor(Math.random()*phoneArray.length)];*/
	    	
	    	res.contentType('application/json');
		    var obj = {"blacklisted": {"mobile": mobile, "pid": pid}};
		    res.send(JSON.stringify(obj));	    	
	    }
	    
	    /*
	    const details = { 'host_number': host_number, 'created_on_date': creation_date };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	  
	    */
	});	
	
	////////////////////////////////////////////////////////////////////////////
	//
	// Select a row based on provided host number and domain:
	// This endpoint is designed to be used by account creation scripts that
	// need to complete phone verification using an sms message code
	// 
	// This endpoint returns the verification code stored for the provided pid 
	// and mobile number, setting the code_used boolean to true to ensure the
	// code is only used once
	//
	// Example Call: http://149.28.244.189:8000/phoneinfo/username/{username}
	// /token/{token}/pid/{pid}/mobile/{mobile}
	//
	app.get('/phoneinfo/username/:username/token/:token/pid/:pid/mobile/:mobile', (req, res) => {
	    const mobile = req.params.mobile;
	    const pid = req.params.pid;
	    const token = req.params.token;
	    const username = req.params.username;
	    if (username == "pvacreator" && token == "6pGja1ntkO4IHrwsBrzd") {
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
		    	  res.send({'error':'An error has occurred'});
		      } else {
                  console.log(result);
                  for (var i in result) {
                        console.log(result[i].verification_code);
                        var item = result[i];
                  }
                  //var item = JSON.parse(result[0]);
		    	  res.contentType('application/json');
		    	  if (item != null ) {
		    		  console.log("the findOne was successful");
		    		  console.log("returned code: "+item.verification_code);
		    		  //console.log(item);
		    		  var obj = {"phone verification code": item.verification_code};
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
                      var obj = {"error": "No verification code available. You probably need to use the phone number for verification prior to calling this API!"};
		    	  }		    	  
		    	  res.send(JSON.stringify(obj));
		      }
		    });
	    }
	});		
};