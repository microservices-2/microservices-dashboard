'use strict';

angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

GraphController.$inject = ['$scope', '$filter', '$modal', '$rootScope', 'GraphService', 'NodeService', 'SetService', 'NodecolorService'];

function GraphController($scope, $filter, $modal, $rootScope, GraphService, NodeService, SetService, NodecolorService) {

    var nodesData, linksData, resultData;
    GraphService.getTypes().then(function (data) {
        console.log(data);
        $scope.legendTypes = data;
    });
    $scope.showLegend = {'height':'0'};

    $scope.getColor = function (node){
        return {'background-color':''+NodecolorService.getColorFor(node)};
    };

    $scope.toggleLegend = function() {
        if($scope.showLegend.height === '0'){
            $scope.showLegend = {'height':'auto'}
        }else{
            $scope.showLegend = {'height':'0'}
        }
    };

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
