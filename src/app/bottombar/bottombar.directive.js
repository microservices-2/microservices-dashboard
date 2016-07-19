/* global angular*/

(function() {
  'use strict';

  /** @ngInject */
  function BottomBarController($scope, $modal, NodeService) {
    $scope.open = function(lane) {
      NodeService.setNode(undefined);
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

      modalInstance.result.then(function(node) {
        NodeService.pushNode(node);
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
