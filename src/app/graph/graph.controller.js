'use strict';

angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

GraphController.$inject = ['$scope', '$filter', '$modal', '$rootScope', 'GraphService', 'NodeService', 'SetService'];

function GraphController($scope, $filter, $modal, $rootScope, GraphService, NodeService, SetService) {

    var nodesData, linksData, resultData;

//  $scope.graphData={nodes:[]};

    function getGraph() {
        GraphService.getGraph().then(function (result) {

            result.data.nodes.forEach(function (node, index) {
                node.index = index;
                result.data.links.forEach(function (d) {
                    if (d.source === node.index) {
                        d.source = node;
                    }
                    if (d.target === node.index) {
                        d.target = node;
                    }
                })
            });

            resultData = result.data;
            nodesData = result.data.nodes;
            linksData = result.data.links;

            $scope.graphData = resultData;
        });
    }

    getGraph();

    $scope.$on('nodesChanged', function (event, value) {
        getGraph();
    });

    /*
     Filter
     */
    this.filterNodes = function (nodeFilter) {
        if ($scope.graphData !== undefined) {
            $scope.graphData.nodes = $filter('nodeFilter')(nodesData, nodeFilter);
            $scope.graphData.links = $filter('linkFilter')(linksData, $scope.graphData.nodes);

            $rootScope.$broadcast('nodesFiltered', $scope.graphData);
        }
    };
}
