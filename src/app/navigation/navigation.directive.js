/* global angular*/
(function() {
  'use strict';

  /** @ngInject */
  function Controller(msdVisuals, msdEventsService) {
    var self = this;

    self.clearAllEvents = clearAllEvents;

    function clearAllEvents() {
      msdEventsService.deleteAllEvents().then(function() {
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
