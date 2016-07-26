//Storerooms service used to communicate Storerooms REST endpoints
(function () {
  'use strict';

  angular
    .module('storerooms')
    .factory('StoreroomsService', StoreroomsService);

  StoreroomsService.$inject = ['$resource'];

  function StoreroomsService($resource) {
    return $resource('api/storerooms/:storeroomId', {
      storeroomId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
