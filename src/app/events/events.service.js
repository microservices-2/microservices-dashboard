/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .service('msdEventsService', Service);

  Service.$inject = ['$http'];
  function Service($http) {
    this.exposedFn = exposedFn;

    // //////////////

    function exposedFn() { }
  }
})();
