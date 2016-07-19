/* global angular*/

(function() {
  'use strict';
  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

  angular
    .module('microServicesGui')
    .config(routeConfig);
})();
