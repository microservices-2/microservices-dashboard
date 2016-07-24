/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('lanefilter', LanefilterDirective);

  /** @ngInject */
  function LanefilterCtrl($rootScope, REQUEST_GRAPH_DATA_SUCCESS, GraphService, $q) {
    var vm = this;

    vm.filter = { details: {} };
    vm.refresh = refresh;

    activate();

    function activate() {
      $q.all([
        GraphService.getTypes(),
        GraphService.getStates()
      ]).then(function(resp) {
        vm.types = resp[0];
        vm.states = resp[1];
      });
      $rootScope.$on(REQUEST_GRAPH_DATA_SUCCESS, function() {
        vm.groups = GraphService.getGroups(GraphService.getGraph().nodes);
      });
    }

    function refresh() {
      GraphService.requestGraph();
      vm.filter = {
        details: {}
      };
    }
  }

  function LanefilterDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/lanefilter/lanefilter.html',
      scope: {
        filter: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: LanefilterCtrl
    };
  }
})();
