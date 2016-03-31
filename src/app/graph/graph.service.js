(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .factory('GraphService', GraphService);

    GraphService.$inject = ['$http', '$q', 'BASE_URL'];

    function GraphService($http, $q, BASE_URL) {
        var factory = {
            getGraph: getGraph,
            getStates: getStates,
            getTypes: getTypes,
            getGroups: getGroups
        };
        return factory;

        function getGraph() {
            return $http.get(BASE_URL + 'graph');
            //return $http.get('graphdata.json');
        }

        function getStates() {
            return $q(function (resolve) {
                resolve([
                    {key: "UP", value: "UP"},
                    {key: "DOWN", value: "DOWN"},
                    {key: "UNKNOWN", value: "UNKNOWN"},
                    {key: "VIRTUAL", value: "VIRTUAL"}]);
            });
        }

        function getTypes() {
            return $q(function (resolve) {
                resolve([{key: "DB", value: "DB"},
                    {key: "REST", value: "REST"},
                    {key: "SOAP", value: "SOAP"},
                    {key: "JMS", value: "JMS"},
                    {key: "MICROSERVICE", value: "MICROSERVICE"},
                    {key: "RESOURCE", value: "RESOURCE"}
                ]);
            });
        }

        function getGroups() {
            return $q(function (resolve) {
                resolve([{key: "BCI", value: "BCI"}, {key: "BPS", value: "BPS"}, {key: "BUSC", value: "BUSC"}, {
                        key: "CRMODS",
                        value: "CRMODS"
                    }, {key: "CSL", value: "CSL"}, {key: "IMA", value: "IMA"}, {key: "MBP", value: "MBP"}, {
                        key: "NGRP",
                        value: "NGRP"
                    }, {key: "OCT", value: "OCT"}, {key: "PDB", value: "PDB"}, {key: "PPT", value: "PPT"}, {
                        key: "RHE",
                        value: "RHE"
                    }, {key: "ROSY", value: "ROSY"}, {key: "SAPACHE", value: "SAPACHE"}]
                );
            });
        }
    }
})();
