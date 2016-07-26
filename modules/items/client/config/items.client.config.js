(function () {
  'use strict';

  angular
    .module('items')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'List Items',
      state: 'items.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'items', {
      title: 'Create Item',
      state: 'items.create',
      roles: ['user']
    });
  }
})();
