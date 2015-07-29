(function () {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('msgSideBar', SideBarDirective);

  /** @ngInject */
  function SideBarDirective() {
    return {
      templateUrl: 'app/sidebar/sidebar.html'
    };
  }

})();
