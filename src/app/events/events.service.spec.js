/* global inject beforeEach it describe expect _ */

(function() {
  'use strict';

  describe('Events Service', function() {
    beforeEach(module('microServicesGui'));

    var service;
    var $httpBackend;

    beforeEach(inject(function(_msdEventsService_, _$httpBackend_) {
      service = _msdEventsService_;
      $httpBackend = _$httpBackend_;
    }));

    it('request() should call /events endpoint', function() {
      $httpBackend.expectGET('http://localhost:8080/events').respond(200);
      service.request();
      $httpBackend.flush();
    });

    it('setEventList() should set the local event list state', function() {
      var eventList = service.getEventList();
      expect(eventList).toEqual([]);

      var newList = _mockList;
      service.setEventList(newList);
      expect(service.getEventList()).toBe(newList);
    });

    describe('Events per node', function() {
      var list;
      var simpleList;

      beforeEach(function() {
        list = _mockList;
        service.setEventList(list);
        simpleList = [
          { message: 'hello', nodeId: 'a' },
          { message: 'world', nodeId: 'a' },
          { message: 'my', nodeId: 'b' },
          { message: 'name', nodeId: 'c' },
          { message: 'is', nodeId: 'b' },
          { message: 'ry', nodeId: 'b' },
          { message: 'animal', nodeId: 'c' }
        ];
      });

      it('should get event count by node id', function() {
        var expected = 2;
        var actual = service.getEventCountByNodeId('customer-group');
        expect(actual).toBe(expected);

        expected = -1;
        actual = service.getEventCountByNodeId();
        expect(actual).toBe(expected);

        expected = -1;
        actual = service.getEventCountByNodeId('');
        expect(actual).toBe(expected);

        expected = 0;
        actual = service.getEventCountByNodeId(23);
        expect(actual).toBe(expected);
      });

      it('should index for quick access', function() {
        var expected = [
          {
            index: 0,
            nodeId: 'a',
            events: [
              { message: 'hello', nodeId: 'a' },
              { message: 'world', nodeId: 'a' }
            ]
          },
          {
            index: 1,
            nodeId: 'b',
            events: [
              { message: 'my', nodeId: 'b' },
              { message: 'is', nodeId: 'b' },
              { message: 'ry', nodeId: 'b' }
            ]
          },
          {
            index: 2,
            nodeId: 'c',
            events: [
              { message: 'name', nodeId: 'c' },
              { message: 'animal', nodeId: 'c' }
            ]
          }
        ];
        var actual = service.createEventsGraph(simpleList);
        expect(actual).toEqual(expected);

        simpleList = [
          { message: 'hello', nodeId: 'a' },
          { message: 'world', nodeId: 'a' },
          { message: 'my', nodeId: 'b' },
          { message: 'name', nodeId: 'c' }
        ];
        expected = [
          {
            index: 0,
            nodeId: 'a',
            events: [
              { message: 'hello', nodeId: 'a' },
              { message: 'world', nodeId: 'a' }
            ]
          },
          {
            index: 1,
            nodeId: 'b',
            events: [
              { message: 'my', nodeId: 'b' }
            ]
          },
          {
            index: 2,
            nodeId: 'c',
            events: [
              { message: 'name', nodeId: 'c' }
            ]
          }
        ];
        actual = service.createEventsGraph(simpleList);
        expect(actual).toEqual(expected);
      });

      it('should return events of a particular node by index', function() {
        service.setEventList(_mockList);
        var nodeEvents = service.getEventsByIndex(service.getIndexMap()['customer-group']);
        expect(nodeEvents.nodeId).toBe('customer-group');
        expect(nodeEvents.events.length).toBe(2);
      });

      it('should remove all events of a perticular node by id', function() {
        service.setEventList(_mockList);
        expect(service.getEventList().length).toBe(26);
        expect(service.getEventsByNodeIdMap().length).toBe(16);
        expect(service.getEventsByNodeIdMap().length).toBe(_.keys(service.getIndexMap()).length);
        service.removedEventsByNodeId('blalbal');
        expect(service.getEventList().length).toBe(26);
        expect(service.getEventsByNodeIdMap().length).toBe(16);
        expect(service.getEventsByNodeIdMap().length).toBe(_.keys(service.getIndexMap()).length);
        service.removedEventsByNodeId('customer-group');
        expect(service.getEventList().length).toBe(24);
        expect(service.getEventsByNodeIdMap().length).toBe(15);
        expect(service.getEventsByNodeIdMap().length).toBe(_.keys(service.getIndexMap()).length);
      });

      it('should get all events by node id', function() {
        var expected = {
          index: 0,
          nodeId: 'customer-group',
          events: [
            { message: 'Exception 404 Not Found for url http://localhost:8089/customer-group/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', throwable: null, nodeId: 'customer-group' },
            { message: 'Exception 404 Not Found for url http://localhost:8089/customer-group/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', throwable: null, nodeId: 'customer-group' }
          ]
        };
        var actual = service.getEventsByNodeId('customer-group');
        expect(actual).toEqual(expected);
        actual = service.getEventsByNodeId('');
        expect(actual).toBeUndefined();
        actual = service.getEventsByNodeId(425);
        expect(actual).toEqual(undefined);
      });
    });
  });

  var _mockList = [{ 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-group/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-group' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/fat-jar-test with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=298, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'fat-jar-test' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/admin with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=291, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'admin' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/user-preferences/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=311, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'user-preferences' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/fat-jar-test/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=307, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'fat-jar-test' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/zuul with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=290, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'zuul' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-addresses with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=304, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-addresses' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/billing-payments/health with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'billing-payments' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/order-processor/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=310, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'order-processor' }, { 'message': 'Exception 500 Server Error for url http://localhost:8089/admin/health with headers [Content-Type=application/vnd.error+json;charset=UTF-8, Server=Jetty(9.2.16.v20160414), content-length=2375]', 'throwable': null, 'nodeId': 'admin' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-group/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-group' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/encryption with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=296, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'encryption' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/fat-jar-test/health with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=305, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'fat-jar-test' }, { 'message': 'Exception 500 Server Error for url http://localhost:8089/user-preferences with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=541, Connection=close, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'user-preferences' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-base/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=308, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-base' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-addresses/health with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=311, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-addresses' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/admin/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=300, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'admin' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/loyalty-program/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=310, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'loyalty-program' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-addresses/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=313, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-addresses' }, { 'message': 'Exception 500 Server Error for url http://localhost:8089/agenda with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=521, Connection=close, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'agenda' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/billing-accounts with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=302, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'billing-accounts' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-management/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=314, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-management' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/user-billing-structure with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=308, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'user-billing-structure' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-administrators with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=309, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-administrators' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/customer-management/health with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=312, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'customer-management' }, { 'message': 'Exception 404 Not Found for url http://localhost:8089/billing-payments/mappings with headers [Cache-Control=must-revalidate,no-cache,no-store, Content-Type=text/html; charset=ISO-8859-1, Content-Length=311, Server=Jetty(9.2.16.v20160414)]', 'throwable': null, 'nodeId': 'billing-payments' }];
})();
