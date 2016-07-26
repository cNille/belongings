'use strict';

/**
 * Module dependencies
 */
var storeroomsPolicy = require('../policies/storerooms.server.policy'),
  storerooms = require('../controllers/storerooms.server.controller');

module.exports = function(app) {
  // Storerooms Routes
  app.route('/api/storerooms').all(storeroomsPolicy.isAllowed)
    .get(storerooms.list)
    .post(storerooms.create);

  app.route('/api/storerooms/:storeroomId').all(storeroomsPolicy.isAllowed)
    .get(storerooms.read)
    .put(storerooms.update)
    .delete(storerooms.delete);

  // Finish by binding the Storeroom middleware
  app.param('storeroomId', storerooms.storeroomByID);
};
