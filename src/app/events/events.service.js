/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .service('msdEventsService', Service);

  Service.$inject = ['$http', 'BASE_URL'];
  function Service($http, BASE_URL) {
    this.request = request;
    // //////////////
    function request() {
      $http
        .get(BASE_URL + 'events')
        .then();
    }
  }
})();
