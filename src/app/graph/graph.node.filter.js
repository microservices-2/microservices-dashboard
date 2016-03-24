(function () {
    'use strict';


    angular.module('microServicesGui')
        .filter('nodeFilter', function () {
            return function (nodes, nodeSearch) {
                var filteredNodes = [];
                for (var i = 0; i < nodes.length; i++) {
                    if (isCurrentLane(nodes[i])) {
                        if (validateId(nodes[i]) && validateStatus(nodes[i]) && validateType(nodes[i]) && validateGroup(nodes[i])) {
                            filteredNodes.push(nodes[i]);
                        }
                    } else {
                        filteredNodes.push(nodes[i]);
                    }
                }
                return filteredNodes;


                function isCurrentLane(node) {
                    return nodeSearch.lane === node.lane;
                }

                function validateId(node) {
                    return nodeSearch.id !== undefined ? (node.id !== undefined && node.id.toLowerCase().indexOf(nodeSearch.id) > -1) : true;
                }

                function validateStatus(node) {
                    if (!isUndefinedOrNull(nodeSearch.details.status)) {
                        return node.details.status === nodeSearch.details.status;
                    }
                    return true;
                }

                function validateType(node) {
                    return (nodeSearch.details.type !== undefined && nodeSearch.type !== null && nodeSearch.type.key !== "ALL") ? (node.details !== undefined && node.details.type !== undefined && node.details.type.toUpperCase() === nodeSearch.type.key) : true;
                }

                function validateGroup(node) {
                    return (nodeSearch.details.group !== undefined && nodeSearch.group !== null && nodeSearch.group.key !== "ALL") ? (node.details !== undefined && node.details.group !== undefined && node.details.group.toUpperCase() === nodeSearch.group.key) : true;
                }

                function isUndefinedOrNull(obj) {
                    return (typeof obj === 'undefined' || obj === null);
                }
            };
        });
})();
