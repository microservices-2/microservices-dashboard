/* global angular _ */
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

    _self.eventList = undefined;

    _self.request = request;
    _self.getEventList = getEventList;
    _self.setEventList = setEventList;
    _self.getEventCountByNodeId = getEventCountByNodeId;

    // //////////////
    function getEventCountByNodeId(id) {
      var count = 0;
      if (id) {
        count = _self.eventList.filter(function(event) {
          return event.nodeId === id;
        }).length;
      } else {
        count = -1;
      }
      return count;
    }
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
