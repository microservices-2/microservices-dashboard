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
                    if(typeof nodeSearch.lane !== 'undefined') {
                        return nodeSearch.lane === node.lane;
                    }
                    return true;
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
                    if (!isUndefinedOrNull(nodeSearch.details.type)) {
                        return node.details.type === nodeSearch.details.type;
                    }
                    return true;
                }

                function validateGroup(node) {
                    if (!isUndefinedOrNull(nodeSearch.details.group)) {
                        return node.details.group === nodeSearch.details.group;
                    }
                    return true;
                }

                function isUndefinedOrNull(obj) {
                    return (typeof obj === 'undefined' || obj === null);
                }
            };
        });
})();
