(function () {
    'use strict';


    angular.module('microServicesGui')
        .filter('nodeFilter', function () {
                return function (nodes, nodeSearch) {
                    var filteredNodes = [];
                    if(nodeSearch.id){
                        nodeSearch.id = nodeSearch.id.toLowerCase();
                    }
                    if (angular.isUndefined(nodeSearch.lane)) {
                        nodes.forEach(function (n) {
                            if (validateId(n)) {
                                if (angular.isUndefined(nodeSearch.details)) {
                                    filteredNodes.push(n);
                                } else if (validateStatus(n) && validateGroup(n) && validateType(n)) {
                                    filteredNodes.push(n);
                                }
                            }
                        });
                    } else {
                        nodes.forEach(function (n) {
                            if (isCurrentLane(n)) {
                                if (validateId(n)) {
                                    if (angular.isUndefined(nodeSearch.details)) {
                                        filteredNodes.push(n);
                                    } else if (validateStatus(n) && validateGroup(n) && validateType(n)) {
                                        filteredNodes.push(n);
                                    }
                                }
                            }
                        });
                    }
                    return filteredNodes;


                    function isCurrentLane(node) {
                        if (typeof nodeSearch.lane !== 'undefined') {
                            return nodeSearch.lane === node.lane;
                        }
                        return true;
                    }

                    function validateId(node) {
                        if(!isUndefinedOrNull(nodeSearch.id)){
                            return node.id.toLowerCase().indexOf(nodeSearch.id) > -1;
                        }
                        return true;
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
                        return (typeof obj === 'undefined' || obj === null || obj === "");
                    }
                };
            }
        );
})();
