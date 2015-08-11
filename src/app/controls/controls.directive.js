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
        scope.$watch('nodeSearch.id', function (newValue) {
          graphController.filterNodes(scope.nodeSearch);
        })
      }
    };
  }

})();
