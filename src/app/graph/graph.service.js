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
      var keyValueArray = [{key:"UP", value:"UP"}, {key:"DOWN",value:"DOWN"}, {key:"UNKNOWN", value:"UNKNOWN"}];
      return keyValueArray;
    }

    function getTypes() {
      return ["DB", "MICROSERVICE", "REST", "SOAP"];
    }

    function getGroups() {
      return ["BCI", "BPS", "BUSC", "CRMODS", "CSL", "IMA", "MBP", "NGRP", "OCT", "PDB", "PPT", "RHE", "ROSY", "SAPACHE"];
    }

  }
})();
