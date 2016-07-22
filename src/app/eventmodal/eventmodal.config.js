/* global angular */
(function() {
  'use strict';

  angular
  .module('microServicesGui')
  .constant('createEventModalConfig', modalConfig);

  function modalConfig(nodeEvents) {
    var modalConfig = {
      templateUrl: 'app/eventmodal/eventmodal.html',
      controller: 'eventModalController',
      controllerAs: 'vm',
      resolve: {
        nodeEvents: function() {
          return nodeEvents;
        }
      }
    };
    return modalConfig;
  }
})();
