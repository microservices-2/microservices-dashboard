/* global jasmine fit it expect inject angular beforeEach describe */
/* jshint unused:false*/
(function() {
  'use strict';

  describe('NodeModalController', function() {
    var mockSetService = {
      add: function() {

      },
      has: function() {
        return true;
      }
    };

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
    var mockGraphService = {
      getGraph: function() {
        return [];
      },
      getStates: function() {
        return ['State1', 'State2', 'State3'];
      },
      getTypes: function() {
        return [];
      },
      getGroups: function() {
        return [];
      }
    };

    beforeEach(module('microServicesGui'), function($provide) {
      $provide.value('GraphService', mockGraphService);
      $provide.value('NodeService', mockNodeService);
      $provide.value('SetService', mockSetService);
    });

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
        $modalInstance: modalInstance,
        currentLane: 1
      });
      expect(ctrl).toBeDefined();
    }));

    it('should have a newNode instance', function() {
      expect(ctrl.newNode).toBeDefined();
    });


    // it('should have 3 states', function() {
    //   expect(angular.isArray(scope.states)).toBeTruthy();
    //   expect(scope.states.length === 3).toBeTruthy();
    // });

    // it('should have the correct configuration for the modalInstance', function() {
    //   expect(scope.nodesList).toBeDefined();
    //   expect(scope.nodesList.placeholder).toMatch('node-placeholder');
    //   expect(scope.nodesList.connectWith).toMatch('.links-container');
    // });

    it('should close the modal if the ok function is triggered', function() {
      ctrl.ok();
      expect(modalInstance.close).toHaveBeenCalledWith(ctrl.newNode);
    });

    it('should dismiss the modal if the cancel function is triggered', function() {
      ctrl.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });

    fit('should set isNewNode to false', function() {
      expect(angular.isUndefined(ctrl.newNode)).toBeFalsy();
      expect(ctrl.x).toBe(1);
    });
  });
  var ms = '{"details":{"type":"MICROSERVICE","status":"UP"},"id":"customer-group","lane":2,"index":4,"x":468.125,"y":160}';
})();
