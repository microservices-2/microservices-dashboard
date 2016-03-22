(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);

  /** @ngInject */
  function NodeService($http, $rootScope, BASE_URL) {
    var nodeToOpen;

    var factory = {
      pushNode: pushNode,
      getNode: getNode,
      setNode: setNode
    };
    return factory;

    function pushNode(node) {
      //TODO: POST request to backend
      $http.post('/dependencies/node', node)
        .then(function(response) {
          $rootScope.$broadcast('nodesChanged', 'Refresh nodes');
        }, function(error) {

        });
    }

    function deleteNode(nodeId) {
      $http.delete(BASE_URL + 'node/'+nodeId);
    }

    function getNode() {
      return nodeToOpen;
    }

    function setNode(n) {
      nodeToOpen = n;
    }
  }
})();
