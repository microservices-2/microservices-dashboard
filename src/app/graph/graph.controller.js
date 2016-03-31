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
            if (!angular.equals({}, prev)) {
                if (isUndefinedEmptyOrNull(value.details.type) && isUndefinedEmptyOrNull(value.details.group) && isUndefinedEmptyOrNull(value.details.status)) {
                    init();
                } else {
                    init(true);
                }
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
            console.log("applied");
            data.nodes = $filter('nodeFilter')(data.nodes, $scope.beFilter);
            var cf = $filter('cascadingFilter')(data.links, nodesData, data.nodes);
            data.nodes = cf.nodes;
            data.links = cf.links;
            return data;
        }

        $scope.getColor = function (node) {
            return {'background-color': '' + NodecolorService.getColorFor(node)};
        };

        function isUndefinedEmptyOrNull(obj) {
            return (typeof obj === 'undefined' || obj === null || obj === "");
        }
    }
})();
