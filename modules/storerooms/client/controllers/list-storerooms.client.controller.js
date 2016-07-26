(function () {
  'use strict';

  angular
    .module('storerooms')
    .controller('StoreroomsListController', StoreroomsListController);

  StoreroomsListController.$inject = ['StoreroomsService'];

  function StoreroomsListController(StoreroomsService) {
    var vm = this;

    vm.storerooms = StoreroomsService.query();
  }
})();
