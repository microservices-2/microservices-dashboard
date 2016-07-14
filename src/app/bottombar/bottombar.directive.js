(function () {
    'use strict';

    function BottomBarController($scope, $modal, NodeService) {
    $scope.open = function (lane) {
      NodeService.setNode(undefined);
      var modalInstance = $modal.open({
        templateUrl: 'app/nodemodal/nodemodal.html',
        controller: 'NodeModalController',
        resolve: {
          currentLane: function () {
            return lane;
          }
        }
      });

      modalInstance.result.then(function (node) {
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

    BottomBarDirective.$inject = [];

    BottomBarController.$inject = ['$scope', '$modal', 'NodeService'];
}());
