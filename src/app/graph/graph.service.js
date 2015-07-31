(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('GraphService', GraphService);

  /** @ngInject */
  function GraphService($http) {
    var factory = {
      getGraph: getGraph
    };
    return factory;

    function getGraph() {
      return $http.get('/rest/graph');
    }
  }
})();
