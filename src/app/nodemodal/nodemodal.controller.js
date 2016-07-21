/* global angular, angular, _ */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('NodeModalController', Controller);

  /** @ngInject */
  function Controller(
    // services
    $scope, $filter, $window, GraphService, NodeService, $modalInstance, SetService, $q,

    // resolved
    currentLane
  ) {
    // View model, variabled used inside the template
    var vm = this;
    vm.isNewNode = false;
    vm.isFixedLane = undefined;
    vm.isVirtualNode = undefined;
    vm.states = [];
    vm.types = [];
    vm.groups = [];
    vm.availableToNodes = [];
    vm.toOptions = {
      connectWith: '.links-container'
    };
    vm.linkedToNodes = [];
    vm.nodesList = {
      placeholder: 'node-placeholder',
      connectWith: '.links-container'
    };
    vm.ok = ok;
    vm.cancel = cancelModal;
    vm.addCustomValue = addCustomValue;
    vm.delete = deleteNode;
    vm.checkFilledIn = checkFilledIn;

    var nodes = [];
    var links = [];

    activate();

    function activate() {
      vm.isFixedLane = true;
      vm.newNode = NodeService.getSelectedNode();
      vm.isNewNode = angular.isUndefined(vm.newNode);
      if (vm.isNewNode) {
        var nodeType = NodeService.getNodeType(currentLane);
        vm.newNode = NodeService.getNewNode(nodeType, currentLane);
      }
      vm.isVirtualNode = vm.newNode.details.status === 'VIRTUAL';
      qryData();
    }

    function qryData() {
      $q.all([
        GraphService.getStates(),
        GraphService.getTypes(),
        GraphService.getGroups()
      ]).then(function(values) {
        vm.states = values[0];
        vm.types = values[1];
        vm.groups = values[2];

        var graphData = GraphService.getGraph();
        nodes = graphData.nodes;
        links = graphData.links;

        var availableToNodes = NodeService.getAvailableNodes(vm.newNode, nodes, links);
        vm.availableToNodes = _.values(availableToNodes)[0];
        vm.linkedToNodes = NodeService.getToLinksByNodeId(vm.newNode.index).map(function(link) {
          return link.target;
        });
      });
    }

    function ok() {
      if (vm.isNewNode) {
        vm.newNode.id = vm.newNode.details.name;
        $modalInstance.close(vm.newNode);
      } else {
        var updates = {
          toLinks: vm.linkedToNodes.map(function(target) {
            return {
              source: vm.newNode,
              target: target
            };
          }),
          sourceNode: vm.newNode
        };
        $modalInstance.close(updates);
      }
    }

    function cancelModal() {
      $modalInstance.dismiss('cancel');
    }

    function deleteNode() {
      NodeService.deleteNode(vm.newNode);
      $modalInstance.dismiss('delete');
    }

    function addCustomValue() {
      vm.newNode.details.custom.push({ key: '', value: '', isNew: true });
    }

    function checkFilledIn(custom) {
      if (custom.key !== '' && custom.value !== '') {
        delete custom.isNew;
        return custom;
      }
      return custom;
    }
  }
})();
