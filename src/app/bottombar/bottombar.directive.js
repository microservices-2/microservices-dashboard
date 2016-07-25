/* global angular*/

(function() {
  'use strict';

  /** @ngInject */
  function BottomBarController(EVENT_SET_LANE_VISIBILITY, $rootScope, $scope, $modal, NodeService) {
    $scope.addButtons = [0, 1, 2, 3];
    $scope.isUiLaneVisible = true;

    $rootScope.$on(EVENT_SET_LANE_VISIBILITY, function(evt, isVisible) {
      if (isVisible) {
        $scope.isUiLaneVisible = true;
        $scope.addButtons = [0, 1, 2, 3];
      } else {
        $scope.isUiLaneVisible = false;
        $scope.addButtons = [1, 2, 3];
      }
    });
    $scope.open = function(lane) {
      NodeService.setSelectedNode(undefined);
      var modalInstance = $modal.open({
        templateUrl: 'app/nodemodal/nodemodal.html',
        controller: 'NodeModalController',
        controllerAs: 'vm',
        resolve: {
          currentLane: function() {
            return lane;
          }
        }
      });

      modalInstance.result.then(function(data) {
        NodeService.addNewNode(data);
      });
    };
  }

  function BottomBarDirective() {
    return {
      templateUrl: 'app/bottombar/bottombar.html',
      controller: BottomBarController
    };
  }

  angular
    .module('microServicesGui')
    .directive('msgBottombar', BottomBarDirective);
})();
