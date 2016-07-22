/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .service('msdEventsService', Service);

  Service.$inject = ['$http', 'BASE_URL'];
  /**
   * Responsible for managing the local event list state.
   * And managing the HTTP RESOURCE /events
   *
   * @param {any} $http
   * @param {any} BASE_URL
   */
  function Service($http, BASE_URL) {
    var _self = this;

    _self.request = request;
    _self.getEventList = getEventList;
    _self.setEventList = setEventList;
    _self.eventList = undefined;

    // //////////////
    function setEventList(list) {
      _self.eventList = list;
    }
    function getEventList() {
      return _self.eventList;
    }
    function request() {
      return $http
        .get(BASE_URL + 'events')
        .then(function(response) {
          if (response.data) {
            _self.eventList = response.data;
          }
        });
    }
  }
})();
