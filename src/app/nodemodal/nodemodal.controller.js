(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('NodeModalController', NodeModalController);

  function NodeModalController($scope, $filter, GraphService, NodeService, $modalInstance) {

    $scope.newNode = NodeService.getNode();
    if ($scope.newNode === undefined) {
      $scope.newNode = {};
    }

    $scope.nodesList = {
      placeholder: "node-placeholder",
      connectWith: ".links-container"
    };

    $scope.states = GraphService.getStates();
    $scope.types = GraphService.getTypes();
    $scope.groups = GraphService.getGroups();
    $scope.availableNodes = [];
    $scope.linkedNodes = [];
    GraphService.getGraph().then(function (result) {
      $scope.nodes = result.data;
      searchLinkedNodes();
    });

    $scope.ok = function() {
      $modalInstance.close($scope.newNode);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    function searchLinkedNodes() {
      $scope.nodes.nodes.forEach(function(node, i) {
        node.index = i;
        $scope.availableNodes.push(node);
        //TODO: determine which node is linked or not
        //$scope.nodes.links.forEach(function(link) {
          //$scope.availableNodes.push(node);
          //if (link.source === node.index) {
          //  $scope.linkedNodes.push($filter("nodeModalFilter")($scope.nodes.nodes, link.target));
          //} else if (d.target === node.index) {
          //  $scope.linkedNodes.push($filter("nodeModalFilter")($scope.nodes.nodes, link.source));
          //} else {
          //  $scope.availableNodes.push(node);
          //}
        //});
      });
    }


  }

})();
