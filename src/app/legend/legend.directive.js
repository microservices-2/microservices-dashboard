(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .directive('legend', LegendDirective);

    function LegendDirective() {
        return {
            restrict: 'A',
            templateUrl: 'app/legend/legend.html',
            scope: {
                types: '='
            },
            controllerAs: 'legend',
            bindToController: true,
            controller: LegendCtrl
        }
    }

    LegendCtrl.$inject = ['NodecolorService'];

    function LegendCtrl(NodecolorService) {
        var legend = this;

        legend.showLegend = {'height': '0'};

        legend.getColor = function (node) {
            return {'background-color': '' + NodecolorService.getColorFor(node)};
        };

        legend.toggle = function () {
            if (legend.showLegend.height === '0') {
                legend.showLegend = {'height': 'auto'}
            } else {
                legend.showLegend = {'height': '0'}
            }
        };
    }
})();