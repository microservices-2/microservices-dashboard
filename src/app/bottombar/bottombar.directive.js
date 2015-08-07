(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgBottombar', NavigationDirective);

  /** @ngInject */
  function NavigationDirective() {
    return {
      templateUrl: 'app/bottombar/bottombar.html'
    };
  }

})();
