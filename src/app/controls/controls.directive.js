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
      link: function (scope, elem, attrs, graphController) {
        scope.$watchGroup(['nodeSearch.id', 'nodeSearch.status', 'nodeSearch.type', 'nodeSearch.group'], function () {
          console.log(scope.nodeSearch.status);
          graphController.filterNodes(scope.nodeSearch);
        })

        scope.states = GraphService.getStates();
        scope.types = GraphService.getTypes();
        scope.groups = GraphService.getGroups();

        //scope.states.unshift('ALL');
        scope.types.unshift('ALL');
        scope.groups.unshift('ALL');

        scope.$watch('countArray.length', function () {
          scope.states = GraphService.getStates();
          scope.states.forEach(function (state, i) {
            scope.states[i].value = state.value + " - " + scope.countArray.filter(function (d) {
                if (state.value === 'ALL') {
                  return true;
                }
                if (d.details != undefined) {
                  return d.details.status === state.value;
                }
                return false;

              }).length
          })
        });

        scope.clearFilter = function () {
          scope.nodeSearch.id = "";

          scope.nodeSearch.status = 'ALL';
          scope.nodeSearch.type = 'ALL';
          scope.nodeSearch.group = 'ALL';
        };
      }
    };
  }

})();
