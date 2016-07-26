(function () {
  'use strict';

  angular
    .module('storerooms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('storerooms', {
        abstract: true,
        url: '/storerooms',
        template: '<ui-view/>'
      })
      .state('storerooms.list', {
        url: '',
        templateUrl: 'modules/storerooms/client/views/list-storerooms.client.view.html',
        controller: 'StoreroomsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Storerooms List'
        }
      })
      .state('storerooms.create', {
        url: '/create',
        templateUrl: 'modules/storerooms/client/views/form-storeroom.client.view.html',
        controller: 'StoreroomsController',
        controllerAs: 'vm',
        resolve: {
          storeroomResolve: newStoreroom
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Storerooms Create'
        }
      })
      .state('storerooms.edit', {
        url: '/:storeroomId/edit',
        templateUrl: 'modules/storerooms/client/views/form-storeroom.client.view.html',
        controller: 'StoreroomsController',
        controllerAs: 'vm',
        resolve: {
          storeroomResolve: getStoreroom
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Storeroom {{ storeroomResolve.name }}'
        }
      })
      .state('storerooms.view', {
        url: '/:storeroomId',
        templateUrl: 'modules/storerooms/client/views/view-storeroom.client.view.html',
        controller: 'StoreroomsController',
        controllerAs: 'vm',
        resolve: {
          storeroomResolve: getStoreroom
        },
        data:{
          pageTitle: 'Storeroom {{ articleResolve.name }}'
        }
      });
  }

  getStoreroom.$inject = ['$stateParams', 'StoreroomsService'];

  function getStoreroom($stateParams, StoreroomsService) {
    return StoreroomsService.get({
      storeroomId: $stateParams.storeroomId
    }).$promise;
  }

  newStoreroom.$inject = ['StoreroomsService'];

  function newStoreroom(StoreroomsService) {
    return new StoreroomsService();
  }
})();
