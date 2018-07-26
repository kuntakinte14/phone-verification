// routes/index.js

const phoneInfoRoutes = require('./phoneinfo_routes');

module.exports = function(app, db) {
  phoneInfoRoutes(app, db);
  // Other route groups could go here, in the future
};