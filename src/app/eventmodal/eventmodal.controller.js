/* global angular, angular, _ */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('eventModalController', Controller);

  /** @ngInject */
  function Controller(
    // services
    $modalInstance, msdEventsService,

    // resolved
    nodeEvents
  ) {
    // View model, variabled used inside the template
    var vm = this;
    vm.id = nodeEvents.nodeId;
    vm.events = nodeEvents.events;
  }
})();
