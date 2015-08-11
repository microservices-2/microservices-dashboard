'use strict';

angular.module('microServicesGui')
  .filter('nodeFilter', function () {
    return function (nodes, nodeSearch) {
      var filteredNodes = [];
      for (var i = 0; i < nodes.length; i++) {
        if (validateId(nodes[i]) && validateStatus(nodes[i]) && validateType(nodes[i]) && validateGroup(nodes[i])) {
          filteredNodes.push(nodes[i]);
          continue;
        }
      }

      function validateId(node) {
        return nodeSearch.id != undefined ? (node.id != undefined && node.id.toLowerCase().indexOf(nodeSearch.id) > -1) : true;
      }

      function validateStatus(node) {
        return (nodeSearch.status != undefined && nodeSearch.status != "ALL") ? (node.details != undefined && node.details.status != undefined && node.details.status.toUpperCase() === nodeSearch.status) : true;
      }

      function validateType(node) {
        return (nodeSearch.type != undefined && nodeSearch.type != "ALL") ? (node.details != undefined && node.details.type != undefined && node.details.type.toUpperCase() === nodeSearch.type) : true;
      }

      function validateGroup(node) {
        return (nodeSearch.group != undefined && nodeSearch.group != "ALL") ? (node.details != undefined && node.details.group != undefined && node.details.group.toUpperCase() === nodeSearch.group) : true;
      }
      return filteredNodes;
    }
  })
  .filter('linkFilter', function () {
    return function (links, nodes) {
      var filteredLinks = [];
      for (var i = 0; i < links.length; i++) {
        var found = false;
        for (var j = 0; j < nodes.length; j++) {
          if (links[i].source.id === nodes[j].id) {
            for (var k = 0; k < nodes.length; k++) {
              if (links[i].target.id === nodes[k].id) {
                found = true;
                break;
              }
            }
          }
        }
        if (found) {
          filteredLinks.push(links[i]);
        }
      }
      return filteredLinks;
    }
  })
