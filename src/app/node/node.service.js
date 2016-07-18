/* global angular*/
(function() {
  'use strict';

  /** @ngInject */
  function NodeService($http, $rootScope, BASE_URL) {
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
          $rootScope.$broadcast('nodesChanged', 'Refresh nodes');
        }, function() {

        });
    }

    function deleteNode(nodeId) {
      if (typeof nodeId !== 'undefined') {
        $http.delete(BASE_URL + 'node/' + nodeId);
      }
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
      deleteNode: deleteNode
    };
    return factory;
  }
  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);
})();
