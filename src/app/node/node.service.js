/* global angular, _ */
(function() {
  'use strict';

  /** @ngInject */
  function NodeService($http, $rootScope, BASE_URL, GraphService, EVENT_NODES_CHANGED) {
    var nodeToOpen;

    function stripUnneededProperties(node) {
      var payload = {};
      payload.details = node.details;
      payload.id = node.id;
      payload.lane = node.lane;
      payload.linkedFromNodeIds = node.linkedFromNodeIds;
      payload.linkedToNodeIds = node.linkedToNodeIds;
      return payload;
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
        case 0:
          return 'UI_COMPONENT';
        case 1:
          return 'RESOURCE';
        case 2:
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
    function getNode() {
      return nodeToOpen;
    }

    function setNode(n) {
      nodeToOpen = n;
    }

    var factory = {
      updateNode: updateNode,
      pushNode: pushNode,
      getNode: getNode,
      setNode: setNode,
      deleteNode: deleteNode,
      getSelectedNode: getSelectedNode,
      getNodeType: getNodeType,
      getNewNode: getNewNode
    };
    return factory;
  }
  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);
})();
