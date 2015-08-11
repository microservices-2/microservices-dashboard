(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('NodeModalController', NodeModalController);

  function NodeModalController($scope, GraphService, NodeService, $modalInstance) {

    $scope.newNode = NodeService.getNode();
    if ($scope.newNode === undefined) {
      $scope.newNode = {};
    }

    $scope.states = GraphService.getStates();
    $scope.types = GraphService.getTypes();
    $scope.groups = GraphService.getGroups();
    GraphService.getGraph().then(function (result) {
      $scope.nodes = result.data;
    });

    $scope.ok = function() {
      $modalInstance.close($scope.newNode);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    }
  }

})();
