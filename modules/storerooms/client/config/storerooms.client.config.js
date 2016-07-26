(function () {
  'use strict';

  angular
    .module('storerooms')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Storerooms',
      state: 'storerooms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'storerooms', {
      title: 'List Storerooms',
      state: 'storerooms.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'storerooms', {
      title: 'Create Storeroom',
      state: 'storerooms.create',
      roles: ['user']
    });
  }
})();
