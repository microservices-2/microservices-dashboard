(function () {

    'use strict';

  function GraphController($scope, $rootScope, $filter, $q, GraphService, NodecolorService) {

    var nodesData, linksData, resultData;

    $scope.showLegend = {'height': '0'};
    $scope.beFilter = {};

    function applyFilters(data) {
      data.links = $filter('linkFilter')(data.links, data.nodes);
      data.nodes = $filter('nodeFilter')(data.nodes, $scope.beFilter);
      var cf = $filter('cascadingFilter2')(data.links, nodesData, data.nodes);
      data.nodes = cf.nodes;
      data.links = cf.links;
      return data;
    }
    function isUndefinedEmptyOrNull(obj) {
      return (typeof obj === 'undefined' || obj === null || obj === '');
    }
    function init(withFilter) {
      $rootScope.dataLoading = true;
      $q.all([
        GraphService.getGraph()
      ]).then(function (values) {
        resultData = values[0].data;
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
          resultData.links = $filter('linkFilter')(resultData.links, resultData.nodes);
          $scope.graphData = resultData;
        }
        $rootScope.dataLoading = false;
      });
    }

    $scope.$watch('beFilter', function (value, prev) {
      if (!angular.equals({}, prev)) {
        if (isUndefinedEmptyOrNull(value.details.type) && isUndefinedEmptyOrNull(value.details.group) && isUndefinedEmptyOrNull(value.details.status) && isUndefinedEmptyOrNull(value.id)) {
          init();
        } else {
          init(true);
        }
      }
    }, true);

    $rootScope.$on('nodesChanged', function(){
      init(true);
    });

    init();



    $scope.getColor = function (node) {
      return {'background-color': '' + NodecolorService.getColorFor(node)};
    };


  }

  angular
        .module('microServicesGui')
        .controller('GraphController', GraphController);

    GraphController.$inject = ['$scope', '$rootScope', '$filter', '$q', 'GraphService', 'NodecolorService'];

}());
