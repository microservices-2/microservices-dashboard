/* global angular*/

(function() {
  'use strict';
  angular.module('microServicesGui')
    .filter('linkFilter', function() {
      return function(links, nodes) {
        var filteredLinks = [];
        links.forEach(function(link) {
          var sourceExists = false,
            targetExists = false;
          for (var i = 0; i < nodes.length; i++) {
            if (!sourceExists && link.source.id === nodes[i].id) {
              sourceExists = true;
            }
            if (!targetExists && link.target.id === nodes[i].id) {
              targetExists = true;
            }
            if (sourceExists && targetExists) {
              filteredLinks.push(link);
              break;
            }
          }
        });
        return filteredLinks;
      };
    });
})();
