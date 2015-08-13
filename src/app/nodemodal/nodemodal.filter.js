(function () {
  'use strict';

  angular.module('microServicesGui')
    .filter('nodeModalFilter', function () {
      return function (nodes, i) {
        console.log(nodes);
        nodes.forEach(function(d) {
          if (d.index === i) {
            return d;
          }
        });
      };
    })
})();
