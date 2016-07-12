(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .directive('msgBottombar', BottomBarDirective);

    function BottomBarDirective() {
      return {
        templateUrl: 'app/bottombar/bottombar.html',
        controller: BottomBarController
      };
    }

    BottomBarDirective.$inject = [];

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
                console.log(node);
                NodeService.pushNode(node);
            });
        };

    }

    BottomBarController.$inject = ['$scope', '$modal', 'NodeService'];
})
();
