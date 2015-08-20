(function () {
  'use strict';


angular.module('microServicesGui')
  .filter('nodeFilter', function () {
    return function (nodes, nodeSearch) {
      var filteredNodes = [];
      console.log('nodes.length='+nodes.length)
      for (var i = 0; i < nodes.length; i++) {
        if (validateId(nodes[i]) && validateStatus(nodes[i]) && validateType(nodes[i]) && validateGroup(nodes[i])) {
          //nodes[i].index = filteredNodes.length;
          filteredNodes.push(nodes[i]);
        }
      }

      function validateId(node) {
        return nodeSearch.id !== undefined ? (node.id !== undefined && node.id.toLowerCase().indexOf(nodeSearch.id) > -1) : true;
      }

      function validateStatus(node) {
        console.log(nodeSearch)
        return (nodeSearch.status !== undefined && nodeSearch.status != null && nodeSearch.status.key !== "ALL") ? (node.details !== undefined && node.details.status !== undefined && node.details.status.toUpperCase() === nodeSearch.status.key) : true;
      }

      function validateType(node) {
        return (nodeSearch.type !== undefined && nodeSearch.type !== "ALL") ? (node.details !== undefined && node.details.type !== undefined && node.details.type.toUpperCase() === nodeSearch.type) : true;
      }

      function validateGroup(node) {
        return (nodeSearch.group !== undefined && nodeSearch.group !== "ALL") ? (node.details !== undefined && node.details.group !== undefined && node.details.group.toUpperCase() === nodeSearch.group) : true;
      }
      return filteredNodes;
    };
  });
})();
