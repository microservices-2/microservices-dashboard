/*global angular*/

(function() {
  'use strict';
  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphController'
      });

    $urlRouterProvider.otherwise('/');
  }

  angular
    .module('microServicesGui')
    .config(routeConfig);



}());
