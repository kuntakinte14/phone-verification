// routes/phoneinfo_routes.js
var moment = require('moment');
var qs = require('querystring');
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	const collection = 

	////////////////////////////////////////////////////////////////////////////
	//
	// DEPRECATED as we are not using this gateway - this is just for testing, 
	// the post handler is what is being used for real message handling
	//
	app.get('/sms-gateway', (req, res) => {
		console.log("sms gateway http get callback:");
		//console.log(req);
		var str = req.url.split('?')[1];
		var urlParams = qs.parse(str);
		//console.log(urlParams);
		
		//console.log(urlParams.message);
		messageParams = urlParams.message.split(" ");
		//console.log(messageParams);
		var code;
		for (i=0; i<=messageParams.length; i++) { 
			//console.log(parseInt(messageParams[i])); 
			//curValue = parseInt(messageParams[i]);
			if (isNaN(messageParams[i])) {
				console.log("this is text, move on");
			}
			else {
				if (messageParams[i] != "365") {
				    code = messageParams[i];
				    console.log("code is: "+code);
				}
			}
		} 
		
		//res.send("hello!");
		res.send(urlParams);
	});

	////////////////////////////////////////////////////////////////////////////
	//
	// DEPRECATED as we are not using this gateway - This processes the http 
	// callback sent from the diafaan SMS gateway when an incoming message is 
	// received by that server
	//
	app.post('/sms-gateway', (req, res) => {
		//console.log("sms gateway http post callback:");
		//console.log(req.body);
		
		messageParams = req.body.message.split(" ");
		//console.log(messageParams);
		var code;
		for (i=0; i<=messageParams.length; i++) { 
			//console.log(parseInt(messageParams[i])); 
			//curValue = parseInt(messageParams[i]);
			if (isNaN(messageParams[i])) {
				console.log("this is text, move on");
			}
			else {
				if (messageParams[i] != "365") {
				    code = messageParams[i];
				    console.log("code is: "+code);
				}
			}
		} 		
		
		const phone = { 
				host_number: req.body.to, 
				remote_number: req.body.from, 
				message: code, 
				full_message_body: req.body,
				created_on_timestamp: moment.utc().format(), 
				created_on_date: moment.utc().format("MM-DD-YYYY"),
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
		    res.send(result.ops[0]);
		  }
		});		
		
		//res.send("http post callback received and processed!");
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
	        var messageArray = responseString.split("\r\n");
	        var messageValues = [];
		    for (i = 0; i < messageArray.length; i++) { 
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
                else if (messageArray[i].includes("Receiver")) {
                    //console.log(messageArray[i]);
                    curValueArray = messageArray[i].split(": ");
                    //console.log(curValueArray[0]+" - "+ curValueArray[1]);
                    messageValues["receiver"] = curValueArray[1];
                    //senderArray = curValueArray;
                    //console.log(messageValues);                           
                }		    	
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
		    	else if (messageArray[i].includes("SCTS")) {
		    		curValueArray = messageArray[i].split(": ");
		    		messageValues["scts"] = curValueArray[1];
		    	}
		    	else if (messageArray[i] !== null && messageArray[i] !== '') {
		    		messageParams = messageArray[i].split(" ");
		    		//console.log(messageArray[i]);
		    		var code;
		    		var fullMessage = messageArray[i];
		    		for (j=0; j<=messageParams.length; j++) { 
		    			//console.log(parseInt(messageParams[i])); 
		    			//curValue = parseInt(messageParams[i]);
		    			if (isNaN(messageParams[j])) {
		    				//console.log("this is text, move on");
		    			}
		    			else {
		    				if (messageParams[j] != "365") {
		    				    code = messageParams[i];
		    				    //console.log("code is: "+code);
		    				}
		    			}
		    		}		    		
		    		//console.log("full message: "+ messageArray[i]);
		    		messageValues["code"] = code;
		    		messageValues["message"] = fullMessage;
		    		//console.log("full message: "+ messageValues["message"]);
		    	}
		    }
		    //console.log(messageValues);
		    // put the rest of the code here
			const phone = { 
					smsc: messageValues["smsc"], 
					sender: messageValues["sender"], 
					message: messageValues["message"], 
					receiver: messageValues["receiver"], 
					verification_code: messageValues["code"],
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
	    });		
		//res.send("sms forwarded message received!");
	});		
		
	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: insert a row, with host_number, remote_number, and message 
	// values passed in the http post call
	//
	app.post('/phoneinfo', (req, res) => {
		console.log("phoneinfo sent: "+ req.body.host_number + " + "+ req.body.message);
		const phone = { 
			host_number: req.body.host_number, 
			remote_number: req.body.remote_number, 
			message: req.body.message, 
			created_on_timestamp: moment.utc().format(), 
			created_on_date: moment.utc().format("MM-DD-YYYY"),
			// add a boolean field called code_used
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
	        res.send(result.ops[0]);
	      }
	    });
	});
	
	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: select a row based on provided id
	//
	app.get('/phoneinfo/:id', (req, res) => {
	    const id = req.params.id;
	    const details = { '_id': new ObjectID(id) };		
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	    
	});

	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: select a row based on provided host number
	//
	app.get('/phoneinfo/host_number/:host_number', (req, res) => {
	    const host_number = req.params.host_number;
	    //console.log(host_number);
	    const details = { 'host_number': host_number };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	    
	});		
	
	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: select a row based on provided host number and message
	//
	app.get('/phoneinfo/host_number/:host_number/message/:message', (req, res) => {
	    const host_number = req.params.host_number;
	    //console.log(host_number);
	    const message = req.params.message;
	    //console.log(message);
	    const details = { 'host_number': host_number, 'message': message };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	    
	});	

	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: select a row based on provided host number and creation date
	//
	app.get('/phoneinfo/host_number/:host_number/creation_date/:date', (req, res) => {
	    const host_number = req.params.host_number;
	    //console.log(host_number);
	    const creation_date = req.params.date;
	    //console.log(creation_date);
	    const details = { 'host_number': host_number, 'created_on_date': creation_date };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	    
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
	    	var phoneArray = ["14153108543",
	    	                  "17025674325",
	    	                  "12056453426",
	    	                  "14805462376",
	    	                  "14794575654"];
	    	var randomItem = phoneArray[Math.floor(Math.random()*phoneArray.length)];
	    	
	    	res.contentType('application/json');
		    var obj = {"phone number": randomItem};
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

		    const filter = { 'smsc': mobile, 'sender': short_code, 'code_used': false };
		    const update = { $set: { code_used: true, updated_on_timestamp: moment.utc().format() } };
		    db.collection('phoneinfo').findOne(filter, (err, item) => {
		      if (err) {
		    	  console.log("an error occurred in the findOne");
		    	  res.send({'error':'An error has occurred'});
		      } else {
		    	  //console.log(item);
		    	  res.contentType('application/json');
		    	  if (item != null ) {
		    		  console.log("the findOne was successful");
		    		  //console.log(item);
		    		  var obj = {"phone verification code": item.verification_code};
		    		  db.collection('phoneinfo').update(filter,update, (err, item) => {
		    		      if (err) {
		    		    	  //res.send({'error':'An error has occurred'});
		    		    	  console.log("an error occurred in the update")
		    		      } else {
		    		    	  console.log("the update was successful");
		    		      }
		    		  });
		    	  }
		    	  else {
		    		  console.log("the findOne did not return a row");
		    		  var obj = {"error": "no verification code available"};	    		  	    		  
		    	  }		    	  
		    	  res.send(JSON.stringify(obj));
		      }
		    });
	    }
	});	
	
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// THIS IS THE TEST ENDPOINT FOR WHITEHATBOX
	//
    // Select a row based on provided host number and domain:
    // This endpoint is designed to be used by account creation scripts that
    // need to complete phone verification using an sms message code
    // http://149.28.244.189:8000/phoneinfo/username/{username}/token/{token}/pid/{pid}/mobile/{mobile}
    /*app.get('/phoneinfo/username/:username/token/:token/pid/:pid/mobile/:mobile', (req, res) => {
        const host_number = req.params.host_number;
        //console.log(host_number);
        const domain = req.params.domain;
        var short_code;
        if (domain == "google") {
            short_code = "22000";
        }
        else if (domain == "yahoo") {
            short_code = "36742";
        } 
        else if (domain == "aol") {
            short_code = "36742";
        }
        else if (domain == "o365") {
            short_code = "732873";
        }*/
        //const short_code = req.params.short_code;
        //console.log(creation_date);
        //console.log()
        // I will need to modify this to use an in clause for the remote_number
        // and update the code_used boolean and set the updated_on_timestamp using
        // findOneAndUpdate
        //const details = { 'host_number': host_number, 'remote_number': short_code };
        /*db.collection('phoneinfo').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
               res.send(item);
              }
            });*/ 
        //res.send({"phone verification code":"564738"});
    //});     	

	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: delete an existing row
	//
	app.delete('/phoneinfo/:id', (req, res) => {
		const id = req.params.id;
		const details = { '_id': new ObjectID(id) };
		db.collection('phoneinfo').remove(details, (err, item) => {
		      if (err) {
		        res.send({'error':'An error has occurred'});
		      } else {
		        res.send('Phone ' + id + ' deleted!');
		      } 
		});
	});	

	////////////////////////////////////////////////////////////////////////////
	//
	// INACTIVE: update an existing row
	//
	app.put('/phoneinfo/:id', (req, res) => {
		//console.log("in the put call");
		//console.log("id: "+req.params.id);
		//console.log(req.body);
		//console.log("first name: "+req.body.first_name);
	    const id = req.params.id;
	    const rowId = { '_id': new ObjectID(id) };
		const phone = { 
				first_name: req.body.first_name, 
				last_name: req.body.last_name, 
				email_address: req.body.email_address, 
				phone_number: req.body.phone_number,
				company_name: req.body.company_name,
				user_id: req.body.user_id,
				domain_name: req.body.domain_name,
				password: req.body.password,
				challenge_code: req.body.challenge_code,
				updated_on_timestamp: moment.utc().format()
		};
	    db.collection('phoneinfo').update(rowId, { $set: phone}, (err, result) => {
	      if (err) {
	          res.send({'error':'An error has occurred'});
	      } else {
	          res.send(phone);
	      } 
	    });
	});	
};