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
    vm.clear = clear;

    activate();
    // ////////////////////////
    function activate() {
      var nodeEvents = msdEventsService.getEventsByNodeId(id);
      if (nodeEvents) {
        vm.events = nodeEvents.events;
      }
    }

    function clear() {
      msdEventsService.removedEventsByNodeId(vm.id);
      if (msdVisuals.isRendered) {
        msdVisuals.reDraw();
      }
      $modalInstance.dismiss('clear');
    }
  }
})();
