// routes/phoneinfo_routes.js

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
	const collection = 
	app.post('/phoneinfo', (req, res) => {
		const phone = { host_number: req.body.host_number, remote_number: req.body.remote_number, message: req.body.message, created_on : new Date() };
	    db.collection('phoneinfo').insert(phone, (err, result) => {
	      if (err) { 
	        res.send({ 'error': 'An error has occurred' }); 
	      } else {
	        res.send(result.ops[0]);
	      }
	    });
	});
	
	app.get('/phoneinfo/:id', (req, res) => {
		//const details = { '_id': <ID GOES HERE> };
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
	
	app.get('/phoneinfo/host_number/:host_number/message/:message', (req, res) => {
		//const details = { '_id': <ID GOES HERE> };
	    const host_number = req.params.host_number;
	    console.log(host_number);
	    const message = req.params.message;
	    console.log(message);
	    //const details = { '_id': new ObjectID(id) };
	    const details = { 'host_number': host_number, 'message': message };
	    db.collection('phoneinfo').findOne(details, (err, item) => {
	      if (err) {
	        res.send({'error':'An error has occurred'});
	      } else {
	        res.send(item);
	      }
	    });	    
	});	
	
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
	
	app.put('/phoneinfo/:id', (req, res) => {
	    const id = req.params.id;
	    const details = { '_id': new ObjectID(id) };
	    const note = { text: req.body.body, title: req.body.title };
	    db.collection('phoneinfo').update(details, phone, (err, result) => {
	      if (err) {
	          res.send({'error':'An error has occurred'});
	      } else {
	          res.send(phone);
	      } 
	    });
	});	
};