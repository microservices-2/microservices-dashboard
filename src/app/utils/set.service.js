(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .factory('SetService', SetService);

  /** @ngInject */
  function SetService($http, $rootScope) {
    var array = [];

    var factory = {
      add: add,
      has: has,
      values: values,
      length: length,
      shift: shift
    };
    return factory;

    function add(element) {
      if (this.array.indexOf(element) === - 1) {
        this.array.push(element);
      }
    }

    function has(element) {
      return this.array.indexOf(element) > -1;
    }

    function values() {
      return this.array;
    }

    function length() {
      return this.array.length;
    }

    function shift() {
      return this.array.shift();
    }
  }
})();
