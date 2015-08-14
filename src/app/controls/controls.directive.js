(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgControls', ['GraphService', ControlsDirective]);

  /** @ngInject */
  function ControlsDirective(GraphService) {
    return {
      templateUrl: 'app/controls/controls.html',
      controller: 'GraphController',
      link: function(scope, elem, attrs, graphController) {
        scope.$watchGroup(['nodeSearch.id', 'nodeSearch.status', 'nodeSearch.type', 'nodeSearch.group'], function () {
          graphController.filterNodes(scope.nodeSearch);
        });

        scope.states = GraphService.getStates();
        scope.types = GraphService.getTypes();
        scope.groups = GraphService.getGroups();
        scope.states.unshift('ALL');
        scope.types.unshift('ALL');
        scope.groups.unshift('ALL');

        scope.clearFilter = function() {
          scope.nodeSearch.id = "";
          scope.nodeSearch.status = 'ALL';
          scope.nodeSearch.type = 'ALL';
          scope.nodeSearch.group = 'ALL';
        };
      }
    };
  }

})();
