'use strict';

angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

GraphController.$inject = ['$scope', '$filter', '$q', 'GraphService', 'NodecolorService'];

function GraphController($scope, $filter, $q, GraphService, NodecolorService) {

    var nodesData, linksData, resultData;

    $scope.showLegend = {'height': '0'};
    $scope.uiFilter = {};
    $scope.epFilter = {};
    $scope.msFilter = {};
    $scope.beFilter = {};

    $scope.$watch('uiFilter', function (value, prev) {
        if (prev) {
            init()
        }
    }, true);
    $scope.$watch('epFilter', function (value, prev) {
        if (prev) {
            init()
        }
    }, true);
    $scope.$watch('msFilter', function (value, prev) {
        if (prev) {
            init()
        }
    }, true);
    $scope.$watch('beFilter', function (value, prev) {
        if (prev) {
            init()
        }
    }, true);

    function init() {
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
                })
            });

            nodesData = resultData.nodes;
            linksData = resultData.links;

            $scope.graphData = applyFilters(resultData);
            //$scope.$emit('nodesFiltered',applyFilters(resultData));
        });
    }

    init();

    function applyFilters(data) {
        data.nodes = $filter('nodeFilter')(data.nodes, $scope.uiFilter);
        data.nodes = $filter('nodeFilter')(data.nodes, $scope.epFilter);
        data.nodes = $filter('nodeFilter')(data.nodes, $scope.msFilter);
        data.nodes = $filter('nodeFilter')(data.nodes, $scope.beFilter);
        data.links = $filter('linkFilter')(data.links, data.nodes);
        return data;
    }

    $scope.getColor = function (node) {
        return {'background-color': '' + NodecolorService.getColorFor(node)};
    };
}
