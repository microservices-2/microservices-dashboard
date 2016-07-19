/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('lanefilter', LanefilterDirective);

  /** @ngInject */
  function LanefilterCtrl(GraphService, $q) {
    var vm = this;

    vm.filter = { details: {} };
    vm.refresh = refresh;

    activate();

    function activate() {
      $q.all([
        GraphService.getTypes(),
        GraphService.getGroups(),
        GraphService.getStates()
      ]).then(function(resp) {
        vm.types = resp[0];
        vm.groups = resp[1];
        vm.states = resp[2];
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
