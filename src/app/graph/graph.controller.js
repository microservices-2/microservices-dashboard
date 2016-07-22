/* global angular, _ */

(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('GraphController', GraphController);

  /** @ngInject */
  function GraphController(
    // services
    $scope, $rootScope, $filter, $q, GraphService, msdEventsService,

    // constants
    REQUEST_GRAPH_DATA_SUCCESS, EVENT_NODES_CHANGED
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
      msdEventsService
        .request()
        .then(function() {
          GraphService.requestGraph();
        });
    }

    function parseGraph(graphData) {
      nodes = graphData.nodes;
      if (withFilter) {
        vm.graphData = applyFilters(graphData);
      } else {
        graphData.links = $filter('linkFilter')(graphData.links, graphData.nodes);
        vm.graphData = graphData;
      }
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
          if (_.isEmpty(value.details.type) && _.isEmpty(value.details.group) && _.isEmpty(value.details.status) && _.isEmpty(value.id)) {
            withFilter = false;
          } else {
            withFilter = true;
          }
          parseGraph(GraphService.getGraph());
        }

        // TODO: investigate. Is the equality check necessary? might have performance penalty
      }, true);
    }

    function addOnNewGraphDataListener() {
      return $rootScope.$on(REQUEST_GRAPH_DATA_SUCCESS, function() {
        parseGraph(GraphService.getGraph());
      });
    }

    function addOnNodeChangesListener() {
      return $rootScope.$on(EVENT_NODES_CHANGED, function() {
        withFilter = true;
        msdEventsService
          .request()
          .then(function() {
            parseGraph(GraphService.getGraph());
          });
      });
    }
  }
})();
