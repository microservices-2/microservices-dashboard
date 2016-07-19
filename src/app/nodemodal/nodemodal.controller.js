/* global angular, angular*/
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .controller('NodeModalController', NodeModalController);

  /** @ngInject */
  function NodeModalController($scope, $filter, $window, GraphService, NodeService, $modalInstance, SetService, $q, currentLane) {
    // View model, variabled used inside the template
    var vm = this;
    vm.isNewNode = undefined;
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
      }).finally(function() {
        searchLinkableNodes();
        searchLinkedNodes();
        setSourcesAndTargets();
      });
    }

    function setAvaliableNodes(availableLanes) {
      nodes.forEach(function(node, i) {
        node.index = i;
        if (availableLanes.indexOf(node.lane) > -1) {
          vm.availableNodes.push(node);
          links.forEach(function(link) {
            if (link.source === node.index) {
              link.source = node;
            }
            if (link.target === node.index) {
              link.target = node;
            }
          });
        }
      });
    }

    function searchLinkableNodes() {
      var LANE_UI = 0,
        LANE_EP = 1,
        LANE_MS = 2,
        LANE_BE = 3;
      switch (vm.newNode.lane) {
        case LANE_UI:
          setAvaliableNodes([LANE_EP]);
          break;
        case LANE_EP:
          setAvaliableNodes([LANE_MS]);
          break;
        case LANE_MS:
          setAvaliableNodes([LANE_EP, LANE_MS, LANE_BE]);
          break;
        case LANE_BE:
          setAvaliableNodes([LANE_MS]);
          break;
        default:
      }
      vm.availableNodes.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    }
    function toId(node) {
      return node.id;
    }
    function addLinkedNode(node) {
      vm.linkedNodes.push(node);
      if (vm.availableNodes.indexOf(node) > -1) {
        vm.availableNodes.splice(vm.availableNodes.indexOf(node), 1);
      }
    }
    function toIdTarget(link) {
      return link.target.id;
    }
    function toIdSource(link) {
      return link.source.id;
    }

    function getLinkedNodes(linkList, currentNode) {
      if (currentNode.id) {
        var targets = linkList
          .filter(function(link) {
            return link.source.id === currentNode.id;
          })
          .map(toIdTarget);

        var sources = linkList
          .filter(function(link) {
            return link.target.id === currentNode.id;
          }).map(toIdSource);
        return {
          linkedFromNodeIds: sources,
          linkedToNodeIds: targets
        };
      }
    }

    function searchLinkedNodes() {
      if (!vm.isNewNode) {
        links.forEach(function(link) {
          if (link.source.id === vm.newNode.id) {
            addLinkedNode($filter('nodeModalFilter')(nodes, link.target)[0]);
          }
        });
      }
      vm.linkedNodes.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    }
    function setSourcesAndTargets() {
      var nodeSourcesAndTargets = getLinkedNodes(links, vm.newNode);
      vm.newNode.linkedFromNodeIds = nodeSourcesAndTargets.linkedFromNodeIds;
      if (vm.linkedNodes.length > 0) {
        vm.newNode.linkedToNodeIds = vm.linkedNodes.map(toId);
      } else {
        vm.newNode.linkedToNodeIds = nodeSourcesAndTargets.linkedToNodeIds;
      }
    }

    function nameExists(name, nodes) {
      var equalNodeNamesCount = nodes.filter(function(node) {
        return node.id === name;
      }).length;
      return equalNodeNamesCount > 0;
    }

    function ok() {
      vm.newNode.linkedNodes = vm.linkedNodes;
      if (typeof vm.newNode.id === 'undefined') {
        var id = vm.newNode.details.name;
        if (nameExists(id, nodes) || angular.isUndefined(id)) {
          // todo use true id generator
          vm.newNode.id = String(new Date().getTime());
        } else {
          vm.newNode.id = id;
        }
      }
      setSourcesAndTargets();
      $modalInstance.close(vm.newNode);
    }

    function cancelModal() {
      $modalInstance.dismiss('cancel');
    }

    function deleteNode() {
      NodeService.deleteNode(vm.newNode.id);
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
