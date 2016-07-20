/* global angular, _ */
(function() {
  'use strict';
  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);
  /** @ngInject */
  function NodeService(
    // services
    $http, $rootScope, GraphService,

    // constants
    BASE_URL, UI_LANE, MS_LANE, RESOURCE_LANE, BE_LANE,

    // events
    EVENT_NODES_CHANGED) {
    var nodeToOpen;
    var factory = {
      getToLinksByNodeId: getToLinksByNodeId,
      getFromLinksByNodeId: getFromLinksByNodeId,
      setSelectedNode: setSelectedNode,
      getSelectedNode: getSelectedNode,
      getAvailableNodes: getAvailableNodes,
      updateNode: updateNode,
      pushNode: pushNode,
      deleteNode: deleteNode,
      getNode: getNode,
      setNode: setNode,
      getNodeType: getNodeType,
      getNewNode: getNewNode
    };

    function getFromLinksByNodeId(nodeIndex) {
      var links = GraphService.getGraph().links;
      var filterFn = selectTargetNodes(nodeIndex);
      return links.filter(filterFn);
    }

    function getToLinksByNodeId(nodeIndex) {
      var links = GraphService.getGraph().links;
      var filterFn = selectSourceNodes(nodeIndex);
      return links.filter(filterFn);
    }

    function setSelectedNode(node) {
      nodeToOpen = _.assign({}, node);
    }

    function getAvailableNodes(selectedNode, nodes, links) {
      var availableNodes = {};
      switch (selectedNode.lane) {
        case UI_LANE:
          _.assign(availableNodes, getResources(selectedNode, nodes, links));
          break;
        case MS_LANE:
          _.assign(
            availableNodes,
            getResources(selectedNode, nodes, links),
            getBackendNodes(selectedNode, nodes, links),
            getMsNodes(selectedNode, nodes, links)
          );
          break;
        case BE_LANE:
          _.assign(
            availableNodes,
            getMsNodes(selectedNode, nodes, links)
          );
          break;
        case RESOURCE_LANE:
          _.assign(
            availableNodes,
            getMsNodes(selectedNode, nodes, links)
          );
          break;
        default:
          break;
      }

      return availableNodes;
    }

    function getNode() {
      return nodeToOpen;
    }

    function setNode(n) {
      nodeToOpen = n;
    }

    function updateNode(node) {
      var preparedNode = stripUnneededProperties(node);
      $http.post(BASE_URL + 'node', preparedNode)
        .then(function() {
          var nodes = GraphService.getGraph().nodes;
          var links = GraphService.getGraph().links;
          var index = GraphService.findNodeIndex(node.id);
          nodes[index] = node;
          GraphService.getGraph().links = updateLinks(links, index, node.linkedToNodeIndices);
          $rootScope.$broadcast(EVENT_NODES_CHANGED);
        });
    }


    function pushNode(node) {
      var preparedNode = stripUnneededProperties(node);
      $http.post(BASE_URL + 'node', preparedNode)
        .then(function() {
          GraphService.addNewNode(node);
          $rootScope.$broadcast(EVENT_NODES_CHANGED);
        }, function() {

        });
    }

    function deleteNode(node) {
      if (typeof node.id !== 'undefined') {
        return $http.delete(BASE_URL + 'node/' + node.id).then(function() {
          var index = GraphService.findNodeIndex(node.id);

          GraphService.getGraph().nodes.splice(index, 1);
          $rootScope.$broadcast(EVENT_NODES_CHANGED);
        });
      }
    }

    function getSelectedNode() {
      return nodeToOpen;
    }

    function getNodeType(laneNr) {
      switch (laneNr) {
        case UI_LANE:
          return 'UI_COMPONENT';
        case RESOURCE_LANE:
          return 'RESOURCE';
        case MS_LANE:
          return 'MICROSERVICE';
        default:
          return 'OTHER';
      }
    }

    function getNewNode(type, laneNr) {
      return {
        details: {
          status: 'VIRTUAL',
          type: type,
          custom: []
        },
        lane: laneNr
      };
    }

    /* ===== Private Methods ===== */
    function selectTargetNodes(nodeIndex) {
      var index = nodeIndex;
      return function(link) {
        return link.target.index === index;
      };
    }

    function selectSourceNodes(nodeIndex) {
      var index = nodeIndex;
      return function(link) {
        return link.source.index === index;
      };
    }

    function getMsNodes(node, nodes, links) {
      return { microServices: filterNodesByLane(nodes, MS_LANE, links)(node) };
    }

    function getBackendNodes(node, nodes, links) {
      return { backEnd: filterNodesByLane(nodes, BE_LANE, links)(node) };
    }

    function getResources(node, nodes, links) {
      return { resources: filterNodesByLane(nodes, RESOURCE_LANE, links)(node) };
    }

    function filterNodesByLane(nodes, laneId, links) {
      return function(selectedNode) {
        return nodes.filter(function(node) {
          return (node.id !== selectedNode.id) && (node.lane === laneId);
        }).filter(function(node) {
          return isLinked(node.index, selectedNode.index, links);
        });
      };
    }

    function isLinked(nodeIndex, selectedNodeIndex, links) {
      var result = links.filter(function(link) {
        var values = _.values(link).map(function(link) {
          return link.index;
        });
        return (values.indexOf(nodeIndex) > -1) && (values.indexOf(selectedNodeIndex) > -1);
      });
      return _.isEmpty(result);
    }

    function updateLinks(links, nodeSourceIndex, targets) {
      var newLinkList = _.assign({}, links);
      targets.forEach(function(targetIndex) {
        var newLink = {
          source: nodeSourceIndex,
          target: targetIndex
        };
        var exisitinLink = (_.find(links, function(link) {
          return link.source === newLink.source && link.target === newLink.target;
        }));
        if (exisitinLink === undefined) {
          newLinkList.push(newLink);
        }
      });
      return newLinkList;
    }

    function stripUnneededProperties(node) {
      var payload = {};
      payload.details = node.details;
      payload.id = node.id;
      payload.lane = node.lane;
      payload.linkedFromNodeIds = node.linkedFromNodeIds;
      payload.linkedToNodeIds = node.linkedToNodeIds;
      return payload;
    }

    return factory;
  }
})();
