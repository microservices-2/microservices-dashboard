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
          graphController.filterNodes(scope.nodeSearch);
        })

        scope.states = GraphService.getStates();
        scope.types = GraphService.getTypes();
        scope.groups = GraphService.getGroups();

        //scope.states.unshift('ALL');
        //scope.types.unshift('ALL');
        //scope.groups.unshift('ALL');

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
          scope.types = GraphService.getTypes();
          scope.types.forEach(function (type, i) {
            scope.types[i].value = type.value + " - " + scope.countArray.filter(function (d) {
                if (type.value === 'ALL') {
                  return true;
                }
                if (d.details != undefined) {
                  return d.details.type === type.value;
                }
                return false;

              }).length
          })
          scope.groups = GraphService.getGroups();
          scope.groups.forEach(function (group, i) {
            scope.groups[i].value = group.value + " - " + scope.countArray.filter(function (d) {
                if (group.value === 'ALL') {
                  return true;
                }
                if (d.details != undefined) {
                  return d.details.group === group.value;
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
