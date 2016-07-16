/* global angular*/
(function() {
  'use strict';

  function NodeColorService() {
    var types = [],
      COLORS = [
        '#f2c319', '#004182', '#a10000', '#674ea7', '#a25203',
        '#794044', '#0a6308', '#123677', '#658200', '#a1a100',
        '#38976d', '#862b59', '#f28686', '#008282', '#078446',
        '#416600', '#99004d', '#6a006a', '#440a7f', '#0021cb',
        '#9db2ff', '#7bf6b6', '#13a7c7', '#00ff7f', '#8b2252'
      ];

    function getColorFor(type) {
      var color = '#8b2252',
        index = types.indexOf(type);

      if (index > -1) {
        return COLORS[index];
      }
      types.push(type);
      return color;
    }

    return {
      getColorFor: getColorFor
    };
  }

  angular
    .module('microServicesGui')
    .factory('NodecolorService', NodeColorService);
})();
