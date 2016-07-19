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
          GraphService.getGraph().nodes.splice(node.index, 1);
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
