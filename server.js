// server.js
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

//require('./app/routes')(app, {});

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err)
	
	// Make sure you add the database name and not the collection name
	dbName = database.db("phoneinfo-api");
	require('./app/routes')(app, dbName);

	app.listen(port, () => {
		console.log('We are live on ' + port);
	});               
})

//app.listen(port, () => {
//  console.log('We are live on ' + port);
//});