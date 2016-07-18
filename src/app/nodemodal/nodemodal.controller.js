/* global angular, angular*/
(function() {
  'use strict';

  /** @ngInject */
  function NodeModalController($scope, $filter, $window, GraphService, NodeService, $modalInstance, SetService, $q, currentLane) {
    function configureNode() {
      $scope.isNewNode = angular.isUndefined($scope.newNode);
      function setNodeType() {
        if (currentLane === 0) {
          $scope.isFixedLane = true;
          return 'UI';
        } else if (currentLane === 1) {
          $scope.isFixedLane = true;
          return 'RESOURCE';
        } else if (currentLane === 2) {
          $scope.isFixedLane = true;
          return 'MICROSERVICE';
        }
        return '';
      }

      if ($scope.isNewNode) {
        $scope.newNode = {
          details: {
            status: 'VIRTUAL',
            type: setNodeType(),
            custom: []
          },
          lane: currentLane
        };
      }
      $scope.isVirtualNode = $scope.newNode.details.status === 'VIRTUAL';
    }
    $scope.states = [];
    $scope.types = [];
    $scope.groups = [];
    $scope.nodesList = {
      placeholder: 'node-placeholder',
      connectWith: '.links-container'
    };
    $scope.availableNodes = [];
    $scope.linkedNodes = [];

    $scope.newNode = NodeService.getNode();
    configureNode();

    var nodes = [],
      links = [];

    function deleteNode(id) {
      NodeService.deleteNode(id);
    }
    function saveNode() {
      $scope.newNode.linkedNodes = $scope.linkedNodes;
    }

    function setAvaliableNodes(availableLanes) {
      nodes.forEach(function(node, i) {
        node.index = i;
        if (availableLanes.indexOf(node.lane) > -1) {
          $scope.availableNodes.push(node);
          links.forEach(function(d) {
            if (d.source === node.index) {
              d.source = node;
            }
            if (d.target === node.index) {
              d.target = node;
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
      switch ($scope.newNode.lane) {
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
      $scope.availableNodes.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    }
    function addLinkedNode(node) {
      $scope.linkedNodes.push(node);
      if ($scope.availableNodes.indexOf(node) > -1) {
        $scope.availableNodes.splice($scope.availableNodes.indexOf(node), 1);
      }
    }

    function toIdTarget(link) {
      return link.target.id;
    }
    function toIdSource(link) {
      return link.source.id;
    }

    function getLinkedNodes(linkList, currentNode) {
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

    function searchLinkedNodes() {
      if (!$scope.isNewNode) {
        links.forEach(function(link) {
          if (link.source.id === $scope.newNode.id) {
            addLinkedNode($filter('nodeModalFilter')(nodes, link.target)[0]);
          }
        });
      }
      $scope.linkedNodes.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      });
    }
    function setSourcesAndTargets() {
      var nodeSourcesAndTargets = getLinkedNodes(links, $scope.newNode);
      $scope.newNode.linkedFromNodeIds = nodeSourcesAndTargets.linkedFromNodeIds;
      $scope.newNode.linkedToNodeIds = nodeSourcesAndTargets.linkedToNodeIds;
    }
    $q.all([
      GraphService.getStates(),
      GraphService.getTypes(),
      GraphService.getGroups(),
      GraphService.getGraph()
    ]).then(function(values) {
      $scope.states = values[0];
      $scope.types = values[1];
      $scope.groups = values[2];
      nodes = values[3].data.nodes;
      links = values[3].data.links;
    }).finally(function() {
      searchLinkableNodes();
      searchLinkedNodes();
      setSourcesAndTargets();
    });

    function nameExists(name, nodes) {
      var equalNodeNamesCount = nodes.filter(function(node) {
        return node.id === name;
      }).length;
      return equalNodeNamesCount > 0;
    }

    $scope.ok = function() {
      saveNode();
      if (typeof $scope.newNode.id === 'undefined') {
        var id = $scope.newNode.details.name;
        if (nameExists(id, nodes) || angular.isUndefined(id)) {
          // todo use true id generator
          $scope.newNode.id = String(new Date().getTime());
        } else {
          $scope.newNode.id = id;
        }
      }
      getLinkedNodes(links, $scope.newNode);
      $modalInstance.close($scope.newNode);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('delete');
    };

    $scope.delete = function() {
      deleteNode($scope.newNode.id);
      $modalInstance.dismiss('cancel');
    };

    $scope.addCustomValue = function() {
      $scope.newNode.details.custom.push({ key: '', value: '', isNew: true });
    };

    $scope.checkFilledIn = function(custom) {
      if (custom.key !== '' && custom.value !== '') {
        delete custom.isNew;
        return custom;
      }
      return custom;
    };
  }

  angular
    .module('microServicesGui')
    .controller('NodeModalController', NodeModalController);
})();
