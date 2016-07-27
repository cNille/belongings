/* globals key */
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // Keymaster redirects
    key('i+c', function() { // To_Items_Create
      console.log('x key pressed');
      $state.go('items.create');
      event.preventDefault();
      return;
    });
    key('i+l', function() { // To_Items_List
      console.log('x key pressed');
      $state.go('items.list');
      event.preventDefault();
      return;
    });

  }
]);
