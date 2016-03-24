(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .directive('lanefilter', LanefilterDirective);

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
        }
    }

    LanefilterCtrl.$inject = ['$scope','GraphService', '$q'];

    function LanefilterCtrl($scope,GraphService, $q) {
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
            details : {},
           lane : parseInt(vm.lane)
        };
    }
})();