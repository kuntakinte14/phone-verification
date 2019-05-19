// routes/index.js

const phoneInfoRoutes = require('./phoneinfo_routes');
const getSMSRoutes = require('./getsms_routes');

module.exports = function(app, db) {
  phoneInfoRoutes(app, db);
  getSMSRoutes(app, db);
  
  // Other route groups could go here, in the future
  app.get('/',function(req,res){
	  //res.send('Hello World!');
	  res.render('home', {layout: 'default', template: 'home-template'});
  });
  
  app.get('/dashboard', (req,res) => {
	  //res.send('this is the getsms page');
      db.collection('phoneinfo').find().toArray( function(err, results) {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            //res.send(item);
        	//console.log(results);
            res.render('dashboard', {layout: 'default', data: results, template: 'dashboard-template'});
          }
      });	  
	  //res.render('dashboard', {layout: 'default', data: results, template: 'dashboard-template'});
  });
};