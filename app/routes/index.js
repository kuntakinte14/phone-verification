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
	 var pidAllPhoneNumbers = ["2064680337","2064714611","2064715491","2064767451","2064767730","2064768862"];
      var pid0PhoneNumbers = ["2064680337", "2064714611", "2064715491", "2064767451", "2064767730", "2064768862",  "2123619084", "2123619080", "2123619128", "2123619134", "2123619144", "2703126629", "2703127142", "2703127491", "2703128669", "2703128904", "6178589306", "6178589629", "8572308245", "8572308314", "8572690025", "3054573501", "3054573561", "3054573627", "3054573666", "3054573673", "6023949846", "6024051067", "6024057350", "6024059024", "6024100426", "9163601799", "9163601851", "9163601935", "9163602744", "9163845692", "4704695743", "4704695744", "4704695745", "4704695746", "4704695747", "3194124132", "3194124167", "3194124291", "3194124371", "3194124519", "3022525568", "3022525687", "3022525730", "3022525982", "3022526048", "7735103696", "7735104340", "7735400296", "7735921784", "7735928223"];
      db.collection('phoneinfo').find({
		$or:
		[
			{'pid':'0','receiver':{$in:pid0PhoneNumbers}},
			{'pid': {$ne:null},'receiver':{$in:pidAllPhoneNumbers}}
		]
	}).sort({_id:-1}).toArray( function(err, results) {
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
