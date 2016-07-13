(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .factory('GraphService', GraphService);

    function GraphService($http, $q, BASE_URL) {
    function getGraph() {
      return $http.get(BASE_URL + 'graph');
      //return $http.get('graphdata.json');
    }

    function getGroups() {
        return $q(function (resolve) {
          resolve([{key: 'BCI', value: 'BCI'}, {key: 'BPS', value: 'BPS'}, {key: 'BUSC', value: 'BUSC'}, {
              key: 'CRMODS',
              value: 'CRMODS'
            }, {key: 'CSL', value: 'CSL'}, {key: 'IMA', value: 'IMA'}, {key: 'MBP', value: 'MBP'}, {
              key: 'NGRP',
              value: 'NGRP'
            }, {key: 'OCT', value: 'OCT'}, {key: 'PDB', value: 'PDB'}, {key: 'PPT', value: 'PPT'}, {
              key: 'RHE',
              value: 'RHE'
            }, {key: 'ROSY', value: 'ROSY'}, {key: 'SAPACHE', value: 'SAPACHE'}]
          );
        });
      }

    function getStates() {
        return $q(function (resolve) {
          resolve([
            {key: 'UP', value: 'UP'},
            {key: 'DOWN', value: 'DOWN'},
            {key: 'UNKNOWN', value: 'UNKNOWN'},
            {key: 'VIRTUAL', value: 'VIRTUAL'}]);
        });
      }

    var factory = {
      getGraph,
      getStates,
      getTypes,
      getGroups
    };
    return factory;


    function getTypes() {
      return $q(function (resolve) {
        resolve([
          {key: 'RESOURCE', value: 'RESOURCE'},
          {key: 'MICROSERVICE', value: 'MICROSERVICE'},
          {key: 'DB', value: 'DB'},
          {key: 'SOAP', value: 'SOAP'},
          {key: 'REST', value: 'REST'},
          {key: 'JMS', value: 'JMS'},
          {key: 'UI', value: 'UI'},
        ]);
      });
    }


  }

    GraphService.$inject = ['$http', '$q', 'BASE_URL'];


})();
