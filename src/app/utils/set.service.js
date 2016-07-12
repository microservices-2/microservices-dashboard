(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .factory('SetService', SetService);

    function SetService() {

        function add(element, array) {
          if (array.indexOf(element) === -1) {
            array.push(element);
          }
          return array;
        }

        var factory = {
            add,
            has
        };
        return factory;



        function has(element, array) {
            return array.indexOf(element) > -1;
        }

    }
})();
