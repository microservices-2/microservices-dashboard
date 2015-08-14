(function () {
  'use strict';

  angular.module('microServicesGui')
    .filter('nodeModalFilter', function () {
      return function (nodes, i) {
        var foundNodes = [];
        nodes.forEach(function(d) {
          console.log(d.id + " " + i.id);
          if (d.id === i.id) {
            foundNodes.push(d);
          }
        });
        return foundNodes;
      };
    })
})();
