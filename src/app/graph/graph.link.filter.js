(function () {
  'use strict';


angular.module('microServicesGui')
  .filter('linkFilter', function () {
    return function (links, nodes) {
      var filteredLinks = new MSGSet();
      for (var i = 0; i < links.length; i++) {
        for (var j = 0; j < nodes.length; j++) {
          if (links[i].source.id === nodes[j].id) {
            for (var k = 0; k < nodes.length; k++) {
              if (links[i].target.id === nodes[k].id) {
                filteredLinks.add(links[i]);
                break;
              }
            }
          }
        }
      }
      return filteredLinks.values();
    };
  });
})();
