(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgControls', ControlsDirective);

  /** @ngInject */
  function ControlsDirective() {
    return {
      templateUrl: 'app/controls/controls.html'
    };
  }

})();
