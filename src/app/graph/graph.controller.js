/* global angular, _ */

(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

  /** @ngInject */
  function GraphController(
    // services
    $scope, $rootScope, $filter, $q, GraphService,

    // constants
    REQUEST_GRAPH_DATA_SUCCESS
  ) {
    // view model
    var vm = this;
    vm.beFilter = {};
    vm.graphData = undefined;

    // private controller state
    var nodes;
    var withFilter;
    var deregisterNodeChange = addOnNodeChangesListener();
    var deregisterNewGraphData = addOnNewGraphDataListener();

    // == Execution == //

    activate();
    addFilterWatch();

    $scope.$on('$destroy', function() {
      deregisterNewGraphData();
      deregisterNodeChange();
    });

    // == Methods == //

    function activate() {
      GraphService.requestGraph()
        .then(getData)
        .then(parseGraph);
    }

    function getData(response) {
      return response.data;
    }

    function parseGraph(data) {
      var graphData = data;

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
      // todo _.assign() might have a performance penalty need to investigate;
      var filteredData = _.assign({}, data);

      filteredData.links = $filter('linkFilter')(filteredData.links, filteredData.nodes);
      filteredData.nodes = $filter('nodeFilter')(filteredData.nodes, vm.beFilter);

      var cf = $filter('cascadingFilter2')(filteredData.links, nodes, filteredData.nodes);
      filteredData.nodes = cf.nodes;
      filteredData.links = cf.links;

      return filteredData;
    }

    function addFilterWatch() {
      $scope.$watch('vm.beFilter', function(value, prev) {
        if (!angular.equals({}, prev) && angular.isDefined(prev)) {
          if (isUndefinedEmptyOrNull(value.details.type) && isUndefinedEmptyOrNull(value.details.group) && isUndefinedEmptyOrNull(value.details.status) && isUndefinedEmptyOrNull(value.id)) {
            withFilter = false;
            parseGraph(GraphService.getGraph());
          } else {
            withFilter = true;
            parseGraph(GraphService.getGraph());
          }
        }
      }, true);
    }

    function addOnNewGraphDataListener() {
      return $rootScope.$on(REQUEST_GRAPH_DATA_SUCCESS, function() {
        parseGraph(GraphService.getGraph());
      });
    }

    function addOnNodeChangesListener() {
      return $rootScope.$on('nodesChanged', function() {
        withFilter = true;
        parseGraph(GraphService.getGraph());
      });
    }

    function isUndefinedEmptyOrNull(obj) {
      return (typeof obj === 'undefined' || obj === null || obj === '');
    }
  }
})();
