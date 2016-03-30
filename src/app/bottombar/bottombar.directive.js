(function () {
    'use strict';

    angular
        .module('microServicesGui')
        .directive('msgBottombar', BottomBarDirective);

    BottomBarDirective.$inject = [];

    function BottomBarDirective() {
        return {
            templateUrl: 'app/bottombar/bottombar.html',
            controller: function ($scope, $modal, NodeService) {
                $scope.open = function (lane) {
                    NodeService.setNode(undefined);
                    var modalInstance = $modal.open({
                        templateUrl: 'app/nodemodal/nodemodal.html',
                        controller: 'NodeModalController',
                        resolve: {
                            currentLane: function() {return lane;}
                        }
                    });

                    modalInstance.result.then(function (node) {
                        NodeService.pushNode(node);
                    });
                };
            }
        };
    }

})();
