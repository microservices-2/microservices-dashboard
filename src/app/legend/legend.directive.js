(function () {

    "use strict";

    angular
        .module('microServicesGui')
        .directive('legend', LegendDirective);

    function LegendDirective() {
        return {
            restrict: 'A',
            templateUrl: 'app/legend/legend.html',
            scope: {
                lane: '@',
                filter: '='
            },
            controllerAs: 'legend',
            bindToController: true,
            replace: true,
            controller: LegendCtrl
        };
    }

    LegendCtrl.$inject = ['NodecolorService', 'GraphService'];

    function LegendCtrl(NodecolorService, GraphService) {
        var legend = this;

        GraphService.getTypes().then(function(data){
            legend.types = data;
        });

        legend.getColor = function (node) {
            return {'border-color': '' + NodecolorService.getColorFor(node)};
        };
    }
})();
