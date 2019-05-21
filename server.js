// server.js
const express        = require('express');
const hbs 			 = require('express-handlebars');
const basicAuth 	 = require('express-basic-auth')
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');

const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/dashboard', basicAuth({
    users: {
        'admin': 'supersecret',
        'adam': 'password1234',
        'eve': 'asdfghjkl',
    },
    challenge: true
}))

app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err)
	
	// Make sure you add the database name and not the collection name
	dbName = database.db("phoneinfo-api");
	require('./app/routes')(app, dbName);

	app.listen(port, () => {
		console.log('We are live on ' + port);
	});               
})
