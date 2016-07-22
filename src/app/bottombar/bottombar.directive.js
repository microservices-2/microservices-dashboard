/* global angular*/

(function() {
  'use strict';

  /** @ngInject */
  function BottomBarController($scope, $modal, NodeService) {
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
