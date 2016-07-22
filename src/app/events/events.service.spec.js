/* global inject beforeEach it describe */

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
  });
})();
