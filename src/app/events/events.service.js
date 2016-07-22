/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .service('msdEventsService', Service);

  Service.$inject = ['$http', 'BASE_URL'];
  /**
   * Responsible for managing the event list local state
   * And managing the HTTP RESOURCE /events
   *
   * @param {any} $http
   * @param {any} BASE_URL
   */
  function Service($http, BASE_URL) {
    var self = this;

    self.request = request;
    self.eventList = [];
    // //////////////
    function request() {
      return $http
        .get(BASE_URL + 'events')
        .then(function(response) {
          if (response.data) {
            self.eventList = response.data;
          }
        });
    }
  }
})();
