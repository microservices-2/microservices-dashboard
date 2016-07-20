/* global angular, _ */

(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('GraphService', GraphService);

  /** @ngInject */
  function GraphService(
    // services
    $rootScope, $http, $q,

    // constants
    BASE_URL, REQUEST_GRAPH_DATA_SUCCESS
  ) {
    var graph = {};

    function getGraphData() {
      return graph;
    }

    function setGraphData(data) {
      _.assign(graph, {}, data);
    }

    // TODO: optimize performance, centralize index state somewhere
    function findIndex(id) {
      for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].id === id) {
          return i;
        }
      }
      return -1;
    }


    /**
     * Removes all links related to a particular node
     * Call this method when you delete a node
     * @param {array} links an array of links, items can be of type
     * {source: number, target:number}
     * or
     * { source: Node, target: Node }
     * @param {number} nodeIndex the array index of the node inside the graph
     * @returns a new array with all the links related to a particular node removed.
     */
    function removeLinkByNodeIndex(links, nodeIndex) {
      return links.filter(function(link) {
        if (isDefaultLinkType(link)) {
          return link.source === nodeIndex;
        }
        return link.source.index !== nodeIndex && link.target.index !== nodeIndex;
      });
    }

    function addNewNode(node) {
      var nodes = graph.nodes;

      if (node && (!_.isEmpty(node))) {
        if (node.id) {
          if (isUnqiue(nodes, node.id)) {
            nodes.push(node);
          }
        }
      }
    }

    function addLink(links, link) {
      var newLinks = links;
      if (links && link) {
        if (linkExists(newLinks, link.source, link.target) === false) {
          newLinks.push(link);
        }
      }
      return newLinks;
    }

    function linkExists(links, sourceIndex, targetIndex) {
      var result = _.find(links, function(l) {
        if (!isDefaultLinkType(l)) {
          return (l.target.index === targetIndex) && (l.source.index === sourceIndex);
        }
        return (l.target === targetIndex) && (l.source === sourceIndex);
      });
      return result !== undefined;
    }

    function isDefaultLinkType(l) {
      return _.isNumber(l.source) && _.isNumber(l.target);
    }

    function isUnqiue(nodes, id) {
      var result = _.find(nodes, function(n) {
        return n.id === id;
      });
      return result === undefined;
    }

    function requestGraph() {
      $rootScope.dataLoading = true;

      return $http
        .get(BASE_URL + 'graph')
        .then(function(response) {
          var graphData = response.data;
          graphData.links = assignNodeToLinks(graphData.nodes, graphData.links);
          _.assign(graph, {}, graphData);
          $rootScope.dataLoading = false;
          $rootScope.$broadcast(REQUEST_GRAPH_DATA_SUCCESS);
          return graphData;
        });
    }

    function assignNodeToLinks(nodes, links) {
      var linksWithNodes = [];
      nodes.forEach(function(node, nodeIndex) {
        linksWithNodes = links.map(function(link) {
          if (link.source === nodeIndex) {
            link.source = node;
          } else if (link.target === nodeIndex) {
            link.target = node;
          }
          return link;
        });
      });
      return linksWithNodes;
    }

    function getGroups() {
      return $q(function(resolve) {
        resolve([
          { key: 'BCI', value: 'BCI' },
          { key: 'BPS', value: 'BPS' },
          { key: 'BUSC', value: 'BUSC' },
          { key: 'CRMODS', value: 'CRMODS' },
          { key: 'CSL', value: 'CSL' },
          { key: 'IMA', value: 'IMA' },
          { key: 'MBP', value: 'MBP' },
          { key: 'NGRP', value: 'NGRP' },
          { key: 'OCT', value: 'OCT' },
          { key: 'PDB', value: 'PDB' },
          { key: 'PPT', value: 'PPT' },
          { key: 'RHE', value: 'RHE' },
          { key: 'ROSY', value: 'ROSY' },
          { key: 'SAPACHE', value: 'SAPACHE' }
        ]);
      });
    }

    function getStates() {
      return $q(function(resolve) {
        resolve([
          { key: 'UP', value: 'UP' },
          { key: 'DOWN', value: 'DOWN' },
          { key: 'UNKNOWN', value: 'UNKNOWN' },
          { key: 'VIRTUAL', value: 'VIRTUAL' }]);
      });
    }

    function getTypes() {
      return $q(function(resolve) {
        resolve([
          { key: 'RESOURCE', value: 'RESOURCE' },
          { key: 'MICROSERVICE', value: 'MICROSERVICE' },
          { key: 'DB', value: 'DB' },
          { key: 'SOAP', value: 'SOAP' },
          { key: 'REST', value: 'REST' },
          { key: 'JMS', value: 'JMS' },
          { key: 'UI', value: 'UI_COMPONENT' }
        ]);
      });
    }

    return {
      removeLinkByNodeIndex: removeLinkByNodeIndex,
      addLink: addLink,
      linkExists: linkExists,
      findNodeIndex: findIndex,
      setGraphData: setGraphData,
      addNewNode: addNewNode,
      getGraph: getGraphData,
      requestGraph: requestGraph,
      getStates: getStates,
      getTypes: getTypes,
      getGroups: getGroups
    };
  }
})();
