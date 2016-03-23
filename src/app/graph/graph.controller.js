'use strict';

angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

GraphController.$inject = ['$scope', '$filter', '$rootScope', '$q', 'GraphService', 'NodecolorService'];

function GraphController($scope, $filter, $rootScope, $q, GraphService, NodecolorService) {

    var nodesData, linksData, resultData;

    $scope.showLegend = {'height':'0'};

    function init() {
        $q.all([
            GraphService.getTypes(),
            GraphService.getGraph()
        ]).then(function (values) {
            $scope.legendTypes = values[0];
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

            $scope.graphData = resultData;
        });
    }
    init();


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

    $scope.$on('nodesChanged', function (event, value) {
        init();
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
