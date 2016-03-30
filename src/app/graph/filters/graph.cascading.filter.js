/**
 * Created by yave on 30/03/16.
 */
(function () {
    "use strict";

    angular
        .module('microServicesGui')
        .filter('cascadingFilter', function () {
            return function (links, allnodes, nodes) {
                var filteredNodes = [],
                    filteredLinks = [],
                    cascadedNodes = [];

                links.forEach(function (l) {
                    if (contains(nodes, l.target)) {
                        filteredLinks.push(l);
                    } else if (contains(nodes, l.source)) {
                        filteredLinks.push(l);
                    }
                });

                filteredLinks.forEach(function (l) {
                    if(!contains(filteredNodes, l.target)){
                        filteredNodes.push(l.target);
                    }
                    if (! contains(filteredNodes, l.source)){
                        filteredNodes.push(l.source);
                    }
                });

                links.forEach(function (l) {
                    if(l.target.lane === 1 || l.source.lane === 1) {
                        if (contains(filteredNodes, l.target) && filteredLinks.indexOf(l) < 0) {
                            filteredLinks.push(l);
                        } else if (contains(filteredNodes, l.source) && filteredLinks.indexOf(l) < 0) {
                            filteredLinks.push(l);
                        }
                    }
                });

                filteredLinks.forEach(function (l) {
                    if(!contains(filteredNodes, l.target)){
                        filteredNodes.push(l.target);
                    }
                    if (! contains(filteredNodes, l.source)){
                        filteredNodes.push(l.source);
                    }
                });

                console.log(filteredLinks);
                console.log(filteredNodes);

                return {
                    links :filteredLinks,
                    nodes : filteredNodes
                }
            };

            function contains(nodelist, node) {
                var count = nodelist.length;
                for (var i = 0; i < count; i++) {
                    if (nodelist[i].id === node.id) {
                        return true;
                    }
                }
                return false;
            }
        });
})();