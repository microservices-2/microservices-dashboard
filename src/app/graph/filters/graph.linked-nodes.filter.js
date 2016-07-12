(function () {
    'use strict';
    angular.module('microServicesGui')
        .filter('linkedNodesFilter', [function () {
            return function (nodes, links) {
                //console.log(nodes,links);
                var filteredNodes = [];
                nodes.forEach(function(n){
                    for(var i = 0; i<links.length;i++){
                        var l = links[i];
                        if(l.source.id === n.id){
                            filteredNodes.push(n);
                            break;
                        }else if(l.target.id === n.id){
                            filteredNodes.push(n);
                            break;
                        }
                    }
                });
                return filteredNodes;
            };
        }]);
}());
