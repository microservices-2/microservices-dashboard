/* global angular*/

(function() {
  'use strict';

  /** @ngInject */
  function config($logProvider, $httpProvider) {
    // enable log debug
    $logProvider.debugEnabled(true);

    // why?
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }

  angular
    .module('microServicesGui')
    .constant('BASE_URL', 'http://localhost:8080/')
    .constant('EVENT_NODES_CHANGED', 'nodesChanged')
    .constant('REQUEST_GRAPH_DATA_SUCCESS', 'New:graph:data')
    .config(config);
})();
