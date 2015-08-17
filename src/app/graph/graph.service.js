(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('GraphService', GraphService);

  /** @ngInject */
  function GraphService($http) {
    var factory = {
      getGraph: getGraph,
      getStates: getStates,
      getTypes: getTypes,
      getGroups: getGroups
    };
    return factory;

    function getGraph() {
      return $http.get('/rest/graph');
    }

    function getStates() {
      return ["UP", "DOWN", "UNKNOWN"];
    }

    function getTypes() {
      return ["DB", "MICROSERVICE", "REST", "SOAP"];
    }

    function getGroups() {
      return ["BCI", "BPS", "BUSC", "CRMODS", "CSL", "IMA", "MBP", "NGRP", "OCT", "PDB", "PPT", "RHE", "ROSY", "SAPACHE"];
    }

  }
})();
