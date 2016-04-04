(function () {

    "use strict";

    angular
        .module('microServicesGui')
        .controller('LegendController', LegendCtrl);

    LegendCtrl.$inject = ['NodecolorService', 'GraphService'];

    function LegendCtrl(NodecolorService, GraphService) {
        var legend = this;

        GraphService.getTypes().then(function(data){
            legend.types = data;
        });

        legend.showLegend = {'height': '0'};

        legend.getColor = function (node) {
            return {'border-color': '' + NodecolorService.getColorFor(node)};
        };

        legend.toggle = function () {
            if (legend.showLegend.height === '0') {
                legend.showLegend = {'height': 'auto'};
            } else {
                legend.showLegend = {'height': '0'};
            }
        };
    }
})();
