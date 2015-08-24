(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);

  /** @ngInject */
  function NodeService($http, $rootScope) {
    var nodeToOpen;

    var factory = {
      pushNode: pushNode,
      getNode: getNode,
      setNode: setNode
    };
    return factory;

    function pushNode(node) {
      node.details.status = node.details.status.key;
      node.details.type = node.details.type.key;
      node.details.group = node.details.group.key;
      //TODO: POST request to backend
      $http.post('rest/graph', node)
        .then(function(response) {
          $rootScope.$broadcast('nodesChanged', 'Refresh nodes');
        }, function(error) {

        });
    }

    function getNode() {
      return nodeToOpen;
    }

    function setNode(n) {
      nodeToOpen = n;
    }
  }
})();
