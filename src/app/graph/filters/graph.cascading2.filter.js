/**
 * Created by yave on 30/03/16.
 */
(function () {
    "use strict";

    angular
        .module('microServicesGui')
        .filter('cascadingFilter2', function () {
            return function (links, allnodes, nodes) {
                var filteredNodes = nodes,
                    filteredLinks = [];

                function getAllLinksWithSource(node) {
                    var linked = [];
                    links.forEach(function (l) {
                        if (l.source.id === node.id) {
                            linked.push(l);
                        }
                    });
                    return linked;
                }

                function getAllLinksWithTarget(node) {
                    var linked = [];
                    links.forEach(function (l) {
                        if (l.target.id === node.id) {
                            linked.push(l);
                        }
                    });
                    return linked;
                }

                function getTargetNodes(arrLinks) {
                    var arrNodes = [];
                    arrLinks.forEach(function (l) {
                        if (!containsNode(arrNodes, l.target)) {
                            arrNodes.push(l.target);
                        }
                    });
                    return arrNodes;
                }

                function getSourceNodes(arrLinks) {
                    var arrNodes = [];
                    arrLinks.forEach(function (l) {
                        if (!containsNode(arrNodes, l.source)) {
                            arrNodes.push(l.source);
                        }
                    });
                    return arrNodes;
                }

                function containsNode(nodelist, node) {
                    var count = nodelist.length;
                    for (var i = 0; i < count; i++) {
                        if (nodelist[i].id === node.id) {
                            return true;
                        }
                    }
                    return false;
                }

                function containsLink(linklist, link) {
                    var count = linklist.length;
                    for (var i = 0; i < count; i++) {
                        if (linklist[i].source.id === link.source.id && linklist[i].target.id === link.target.id) {
                            return true;
                        }
                    }
                    return false;
                }

                function merge(arr,results){
                    arr.forEach(function (l){
                        if(!containsLink(results,l)){
                            results.push(l);
                        }
                    });
                    return results;
                }

                function getNodesFromLinks(arrLinks,results){
                    arrLinks.forEach(function(l){
                        if(!containsNode(results, l.source)){
                            results.push(l.source);
                        }
                        if(!containsNode(results, l.target)){
                            results.push(l.target);
                        }
                    });
                    return results;
                }

                function getLinksForNode(node) {
                  var finalLinks = [],
                    tempLinks = getAllLinksWithTarget(node),
                    whileLinks = [],
                    prevCount = 0,
                    tempNodes = [];

                  if (node.lane != 0) {
                    do {
                      tempNodes = getSourceNodes(tempLinks);
                      tempNodes.forEach(function (n) {
                        whileLinks = whileLinks.concat(getAllLinksWithTarget(n));
                      });
                      prevCount = finalLinks.count;
                      finalLinks = finalLinks.concat(tempLinks);
                      tempLinks = whileLinks;
                      whileLinks = [];
                    } while (tempLinks.length !== 0);
                  }

                  if (node.lane != 3) {
                    tempLinks = getAllLinksWithSource(node);

                    do {
                      tempNodes = getTargetNodes(tempLinks);
                      tempNodes.forEach(function (n) {
                        whileLinks = whileLinks.concat(getAllLinksWithSource(n));
                      });
                      prevCount = finalLinks.count;
                      finalLinks = finalLinks.concat(tempLinks);
                      tempLinks = whileLinks;
                      whileLinks = [];
                    } while (tempLinks.length !== 0);
                  }

                  return finalLinks;
                }

                filteredNodes.forEach(function (n) {
                    if (n.lane === 0) {
                        filteredLinks = merge(getLinksForNode(n), filteredLinks);
                    } else if (n.lane === 1) {
                        filteredLinks = merge(getLinksForNode(n),filteredLinks);
                    } else if (n.lane === 2) {
                        filteredLinks = merge(getLinksForNode(n),filteredLinks);
                    } else if (n.lane === 3) {
                        filteredLinks = merge(getLinksForNode(n),filteredLinks);
                    }
                });

                filteredNodes = getNodesFromLinks(filteredLinks,filteredNodes);

                return {
                    links: filteredLinks,
                    nodes: filteredNodes
                };
            };
        });
})();
