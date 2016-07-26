(function () {
  'use strict';

  // Storerooms controller
  angular
    .module('storerooms')
    .controller('StoreroomsController', StoreroomsController);

  StoreroomsController.$inject = ['$scope', '$state', 'Authentication', 'storeroomResolve'];

  function StoreroomsController ($scope, $state, Authentication, storeroom) {
    var vm = this;

    vm.authentication = Authentication;
    vm.storeroom = storeroom;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Storeroom
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.storeroom.$remove($state.go('storerooms.list'));
      }
    }

    // Save Storeroom
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.storeroomForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.storeroom._id) {
        vm.storeroom.$update(successCallback, errorCallback);
      } else {
        vm.storeroom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('storerooms.view', {
          storeroomId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
