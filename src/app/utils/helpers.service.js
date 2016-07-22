/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .service('helpers', Service);

  Service.$inject = [];
  function Service() {
    var _self = this;

    _self.formatClassName = formatClassName;

    // //////////////
    function formatClassName(prefix, object) {
      if (object.id) {
        return prefix + '-' + object.id.replace(/(\.|\/|:)/gi, '-');
      }
    }
  }
})();
