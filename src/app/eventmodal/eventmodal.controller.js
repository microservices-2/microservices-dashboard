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
    vm.events = [];
    vm.clear = clear;
    vm.nodeIdSet = undefined;
    vm.onSelect = onSelect;
    vm.selectedId = id;
    activate();
    // ////////////////////////
    function onSelect() {
      vm.events = msdEventsService.getEventsByNodeId(vm.selectedId).events;
    }
    function activate() {
      var nodeEvents = msdEventsService.getEventsByNodeId(vm.selectedId);
      vm.nodeIdSet = msdEventsService.getIndexMap();

      if (nodeEvents) {
        vm.events = nodeEvents.events;
      }
    }

    function clear() {
      msdEventsService.removedEventsByNodeId(vm.selectedId);
      if (msdVisuals.isRendered) {
        msdVisuals.reDraw();
      }
      $modalInstance.dismiss('clear');
    }
  }
})();
