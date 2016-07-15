(function () {
    'use strict';

  function LanefilterCtrl(GraphService, $q) {
    var vm = this;

    $q.all([
      GraphService.getTypes(),
      GraphService.getGroups(),
      GraphService.getStates()
    ]).then(function (resp) {
      vm.types = resp[0];
      vm.groups = resp[1];
      vm.states = resp[2];
    });

    vm.filter = {
      details: {}
    };

    vm.refresh = function(){
      vm.filter = {
        details: {}
      };
    };

    if(typeof vm.lane !== 'undefined'){
      vm.filter.lane = parseInt(vm.lane);
    }
  }

  function LanefilterDirective() {
    return {
      restrict: 'A',
      templateUrl: 'app/lanefilter/lanefilter.html',
      scope: {
        lane: '@',
        filter: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: LanefilterCtrl
    };
  }

    angular
        .module('microServicesGui')
        .directive('lanefilter', LanefilterDirective);


    LanefilterCtrl.$inject = ['GraphService', '$q'];

}());
