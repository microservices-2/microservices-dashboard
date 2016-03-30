(function () {

    "use strict";

    angular
        .module('microServicesGui')
        .controller('GraphController', GraphController);

    GraphController.$inject = ['$scope', '$rootScope', '$filter', '$q', 'GraphService', 'NodecolorService'];

    function GraphController($scope, $rootScope, $filter, $q, GraphService, NodecolorService) {

        var nodesData, linksData, resultData;

        $scope.showLegend = {'height': '0'};
        $scope.beFilter = {};

        $scope.$watch('beFilter', function (value, prev) {
            if (!angular.equals({}, prev)){
                if(value.details.type!==null || value.details.group!==null) {
                    init(true);
                }
                init();
            }
        }, true);

        function init(withFilter) {
            $rootScope.dataLoading = true;
            $q.all([
                GraphService.getTypes(),
                GraphService.getGraph()
            ]).then(function (values) {
                $scope.types = values[0];
                resultData = values[1].data;
                resultData.nodes.forEach(function (node, index) {
                    node.index = index;
                    resultData.links.forEach(function (d) {
                        if (d.source === node.index) {
                            d.source = node;
                        }
                        if (d.target === node.index) {
                            d.target = node;
                        }
                    });
                });

                nodesData = resultData.nodes;
                linksData = resultData.links;

                if (withFilter) {
                    $scope.graphData = applyFilters(resultData);
                } else {
                    $scope.graphData = resultData;
                }
                $rootScope.dataLoading = false;
            });
        }

        init();

        function applyFilters(data) {
            //data.nodes = $filter('nodeFilter')(data.nodes, $scope.uiFilter);
            //data.nodes = $filter('nodeFilter')(data.nodes, $scope.epFilter);
            //data.nodes = $filter('nodeFilter')(data.nodes, $scope.msFilter);
            console.log($scope.beFilter, $scope.beFilter.details);
            data.nodes = $filter('nodeFilter')(data.nodes, $scope.beFilter);
            //data.links = $filter('linkFilter')(data.links, data.nodes);
            var cf = $filter('cascadingFilter')(data.links, nodesData, data.nodes);
            data.nodes = cf.nodes;
            data.links = cf.links;
            return data;
        }

        $scope.getColor = function (node) {
            return {'background-color': '' + NodecolorService.getColorFor(node)};
        };
    }
})();
