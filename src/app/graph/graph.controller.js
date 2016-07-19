/* global angular */

(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

  /** @ngInject */
  function GraphController(
    $scope, $rootScope, $filter, $q, GraphService
  ) {
    // view model
    var vm = this;
    vm.beFilter = {};
    vm.graphData = undefined;

    // private controller state
    var nodes;
    var withFilter;

    activate();
    addOnNodeChangesListener();
    addFilterWatch();

    function activate() {
      $rootScope.dataLoading = true;

      GraphService.getGraph()
        .then(parseGraphResponse);
    }

    function parseGraphResponse(response) {
      var graphData = response.data;

      graphData.nodes.forEach(function(node, index) {
        node.index = index;
        graphData.links.forEach(function(link) {
          if (link.source === node.index) {
            link.source = node;
          }
          if (link.target === node.index) {
            link.target = node;
          }
        });
      });

      nodes = graphData.nodes;

      if (withFilter) {
        vm.graphData = applyFilters(graphData);
      } else {
        graphData.links = $filter('linkFilter')(graphData.links, graphData.nodes);
        vm.graphData = graphData;
      }

      $rootScope.dataLoading = false;
    }

    function applyFilters(data) {
      data.links = $filter('linkFilter')(data.links, data.nodes);
      data.nodes = $filter('nodeFilter')(data.nodes, vm.beFilter);

      var cf = $filter('cascadingFilter2')(data.links, nodes, data.nodes);
      data.nodes = cf.nodes;
      data.links = cf.links;

      return data;
    }

    function addFilterWatch() {
      $scope.$watch('vm.beFilter', function(value, prev) {
        if (!angular.equals({}, prev) && angular.isDefined(prev)) {
          if (isUndefinedEmptyOrNull(value.details.type) && isUndefinedEmptyOrNull(value.details.group) && isUndefinedEmptyOrNull(value.details.status) && isUndefinedEmptyOrNull(value.id)) {
            withFilter = false;
            activate();
          } else {
            withFilter = true;
            activate();
          }
        }
      }, true);
    }

    function addOnNodeChangesListener() {
      $rootScope.$on('nodesChanged', function() {
        withFilter = true;
        activate();
      });
    }

    function isUndefinedEmptyOrNull(obj) {
      return (typeof obj === 'undefined' || obj === null || obj === '');
    }
  }
})();
