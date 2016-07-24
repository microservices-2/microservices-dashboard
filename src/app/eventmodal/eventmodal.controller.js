/* global angular, angular, _ */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('eventModalController', Controller);

  /** @ngInject */
  function Controller(
    // services
    $modalInstance, msdEventsService, msdVisuals,

    // resolved
    id
  ) {
    // View model, variabled used inside the template
    var vm = this;
    vm.id = id;
    vm.events = [];
    var nodeEvents = msdEventsService.getEventsByNodeId(id);
    if (nodeEvents) {
      vm.events = nodeEvents.events;
    }
    vm.clear = clear;
    // ////////////////////////
    function clear() {
      msdEventsService.removedEventsByNodeId(vm.id);
      if (msdVisuals.isRendered) {
        msdVisuals.reDraw();
      }
      $modalInstance.dismiss('clear');
    }
  }
})();
