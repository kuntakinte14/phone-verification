// routes/phoneinfo_routes.js

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	const collection = 
	
	// insert a row	
	app.post('/phoneinfo', (req, res) => {
		const phone = { 
			host_number: req.body.host_number, 
			remote_number: req.body.remote_number, 
			message: req.body.message, 
			created_on_timestamp: new Date(), 
			created_on_date: new Date().toDateString(),
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
	
	// select a row based on provided id
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
	
	// select a row based on provided host number
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
	
	// select a row based on provided host number and message
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
	
	// select a row based on provided host number and creation date
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
	
	// delete an existing row
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
	
	// update an existing row
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
				updated_on_timestamp: new Date()
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