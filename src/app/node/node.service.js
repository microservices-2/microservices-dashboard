/*global angular*/

(function () {
    'use strict';

    /** @ngInject */
    function NodeService($http, $rootScope, BASE_URL) {
      var nodeToOpen;

      function pushNode(node) {
        $http.post(BASE_URL+'node', node)
          .then(function () {
            $rootScope.$broadcast('nodesChanged', 'Refresh nodes');
          }, function () {

          });
      }

      function deleteNode(nodeId) {
        if(typeof nodeId !== 'undefined') {
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
        pushNode,
        getNode,
        setNode,
        deleteNode
      };
      return factory;


    }

    angular
        .module('microServicesGui')
        .factory('NodeService', NodeService);

}());
