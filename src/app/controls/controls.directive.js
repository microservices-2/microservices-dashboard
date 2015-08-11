(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgControls', ControlsDirective);

  /** @ngInject */
  function ControlsDirective() {
    return {
      templateUrl: 'app/controls/controls.html',
      controller: 'GraphController',
      link: function(scope, elem, attrs, graphController) {
        scope.$watchGroup(['nodeSearch.id', 'nodeSearch.status', 'nodeSearch.type', 'nodeSearch.group'], function () {
          graphController.filterNodes(scope.nodeSearch);
        });

        scope.states = ["ALL", "UP", "DOWN", "UNKNOWN"];
        scope.types = ["ALL", "SOAP", "DB", "REST"];
        scope.groups = ["ALL", "NGRP", "RHE", "BPS", "BCI", "ROSY", "RHE", "PPT", "CHRMODS", "MBP", "IMA", "CSL", "BUSC", "PDB", "PPT", "SAPACHE", "OCT"]
      }
    };
  }

})();
