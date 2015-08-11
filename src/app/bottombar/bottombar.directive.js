(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgBottombar', BottomBarDirective);

  /** @ngInject */
  function BottomBarDirective() {
    return {
      templateUrl: 'app/bottombar/bottombar.html',
      controller: function($scope, $modal, NodeService) {
        $scope.open = function () {
          NodeService.setNode(undefined);
          var modalInstance = $modal.open({
            templateUrl: 'app/nodemodal/nodemodal.html',
            controller: 'NodeModalController'
          });

          modalInstance.result.then(function (node) {
            NodeService.pushNode(node);
          })
        }
      }
    };
  }

})();
