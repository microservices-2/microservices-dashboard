/* global angular, angular*/
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('NodeModalController', NodeModalControllerVersion2);

  /** @ngInject */
  function NodeModalControllerVersion2(
    // service
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
    vm.availableNodes = [];
    vm.linkedNodes = [];
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
      });
    }

    function ok() {
      if (typeof vm.newNode.id === 'undefined') {
        var id = vm.newNode.details.name;
        if (nameExists(id, nodes) || angular.isUndefined(id)) {
          // todo use true id generator
          vm.newNode.id = String(new Date().getTime());
        } else {
          vm.newNode.id = id;
        }
      }
      $modalInstance.close(vm.newNode);
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
