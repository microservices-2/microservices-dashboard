/*global inject*/

(function () {
  'use strict';

  describe('NodeService', function () {

    var NodeService, $httpBackend, rootScope, newNode;
    beforeEach(module('microServicesGui'));

    beforeEach(inject(function (_$httpBackend_, $rootScope, _NodeService_) {
      $httpBackend = _$httpBackend_;
      rootScope = $rootScope;
      NodeService = _NodeService_;
      newNode = {
        id: 'testNode',
        details: {
          status: {
            key: 'Test'
          },
          type: {
            key: 'Test'
          },
          group: {
            key: 'Test'
          }
        }
      };
    }));

    it('should set the newNode', function () {
      NodeService.setNode(newNode);
      expect(NodeService.getNode()).toEqual(newNode);
    });

    it('should post the node to the backend', function() {
      $httpBackend.expectPOST('rest/graph', newNode).respond(201, '');
      NodeService.pushNode(newNode);
      $httpBackend.flush();
    });
  });
}());
