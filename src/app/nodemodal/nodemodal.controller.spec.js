/* global jasmine fit it expect inject angular beforeEach describe */
/* jshint unused:false*/
(function() {
  'use strict';

  describe('NodeModalController', function() {
    var mockNodeService = {
      pushNode: function() {

      },
      getSelectedNode: function() {
        return JSON.parse(ms);
      },
      getNode: function() {
        return {};
      },
      setNode: function() {

      }
    };

    beforeEach(module('microServicesGui'));

    var ctrl, scope, filter, modalInstance;

    beforeEach(inject(function($rootScope, $controller, _$filter_) {
      scope = $rootScope.$new();
      filter = _$filter_;
      modalInstance = {                    // Create a mock object using spies
        close: jasmine.createSpy('modalInstance.close'),
        dismiss: jasmine.createSpy('modalInstance.dismiss'),
        result: {
          then: jasmine.createSpy('modalInstance.result.then')
        }
      };
      ctrl = $controller('NodeModalController', {
        $scope: scope,
        $filter: filter,
        NodeService: mockNodeService,
        $modalInstance: modalInstance,
        currentLane: 1
      });
      expect(ctrl).toBeDefined();
    }));

    it('should have a newNode instance', function() {
      expect(ctrl.newNode).toBeDefined();
    });

    it('should close the modal if the ok function is triggered', function() {
      ctrl.ok();
      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should dismiss the modal if the cancel function is triggered', function() {
      ctrl.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    describe('when updating an existing node', function() {
      it('should set isNewNode to false', function() {
        expect(angular.isUndefined(ctrl.newNode)).toBeFalsy();
        expect(ctrl.isNewNode).toBeFalsy();
        expect(ctrl.isVirtualNode).toBeFalsy();
      });
    });
  });
  var ms = '{"details":{"type":"MICROSERVICE","status":"UP"},"id":"customer-group","lane":2,"index":4,"x":468.125,"y":160}';
})();
