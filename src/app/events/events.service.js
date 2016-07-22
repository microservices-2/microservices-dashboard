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
    _self.getEventsByNodeId = getEventsByNodeId;
    _self.createEventsGraph = createEventsGraph;

    // //////////////
    function createEventsGraph(list) {
      var index = 0;
      return list.reduce(function(graph, event) {
        var result = graph.filter(function(graphElement) {
          return graphElement.nodeId === event.nodeId;
        });
        if (result.length === 1) {
          var element = result[0];
          element.events.push(event);
        } else {
          index += 1;
          var evts = [];
          evts.push(event);
          graph.push({
            index: index,
            nodeId: event.nodeId,
            events: evts
          });
        }
        return graph;
      }, []);
    }

    function getEventsByNodeId(id) {
      if (id) {
        var nodeEvents = {
          nodeId: id,
          events: filterById(id)
        };
        return nodeEvents;
      }
      return undefined;
    }
    function filterById(id) {
      return _self.eventList.filter(function(event) {
        return event.nodeId === id;
      });
    }
    function getEventCountByNodeId(id) {
      var count = 0;
      if (id) {
        count = filterById(id).length;
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
