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

    // lane numbers
    .constant('UI_LANE', 0)
    .constant('RESOURCE_LANE', 1)
    .constant('MS_LANE', 2)
    .constant('BE_LANE', 3)

    // modal
    .constant('createModalConfig', modalConfig)

    // events
    .constant('EVENT_NODES_CHANGED', 'nodesChanged')
    .constant('REQUEST_GRAPH_DATA_SUCCESS', 'New:graph:data')
    .config(config);


  function modalConfig(currentLane) {
    var modalConfig = {
      templateUrl: 'app/nodemodal/v2/nodemodal.html',
      controller: 'NodeModalController',
      controllerAs: 'vm',
      resolve: {
        currentLane: function() {
          return currentLane;
        }
      }
    };

    return modalConfig;
  }
})();
