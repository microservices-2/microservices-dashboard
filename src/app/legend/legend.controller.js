// (function () {
//
//    "use strict";
//
//    angular
//        .module('microServicesGui')
//        .controller('LegendController', LegendCtrl);
//
//    LegendCtrl.$inject = ['NodecolorService', 'GraphService'];
//
//    function LegendCtrl(NodecolorService, GraphService) {
//        var legend = this;
//
//        GraphService.getTypes().then(function(data){
//            legend.types = data;
//        });
//
//        legend.getColor = function (node) {
//            return {'border-color': '' + NodecolorService.getColorFor(node)};
//        };
//    }
// })();
