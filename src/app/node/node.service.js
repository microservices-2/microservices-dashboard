(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('NodeService', NodeService);

  /** @ngInject */
  function NodeService($http) {
    var nodeToOpen;

    var factory = {
      pushNode: pushNode,
      getNode: getNode,
      setNode: setNode
    };
    return factory;

    function pushNode(node) {
      //TODO: POST request to backend
      $http.post('rest/graph', node)
        .then(function(response) {
          console.log(response);
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
