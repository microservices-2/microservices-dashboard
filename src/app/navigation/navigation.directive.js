/* global angular*/
(function() {
  'use strict';

  /** @ngInject */
  function Controller($modal, createEventModalConfig, msdVisuals, msdEventsService, GraphService) {
    var self = this;
    self.clearAllEvents = clearAllEvents;
    self.isUiLaneVisible = true;
    self.onChange = onChange;
    self.openEventsModal = openEventsModal;
    self.modal = $modal;
    self.evictCache = evictCache;

    function evictCache() {
      GraphService.evict()
        .then(function(evictCacheSuccess) {
          return msdEventsService.request();
        })
        .then(function(eventsFetched) {
          return GraphService.requestGraph();
        });
    }
    function openEventsModal() {
      var modalConfig = createEventModalConfig(undefined);
      self.modal.open(modalConfig);
    }

    function onChange() {
      msdVisuals.setUiLaneVisibility(self.isUiLaneVisible);
    }

    function clearAllEvents() {
      msdEventsService
        .deleteAllEvents()
        .then(function() {
          if (msdVisuals.isRendered) {
            msdVisuals.reDraw();
          }
        });
    }
  }

  function NavigationDirective() {
    return {
      templateUrl: 'app/navigation/navigation.html',
      controller: Controller,
      controllerAs: 'vm'
    };
  }

  angular
    .module('microServicesGui')
    .directive('msgNavigation', NavigationDirective);
})();
