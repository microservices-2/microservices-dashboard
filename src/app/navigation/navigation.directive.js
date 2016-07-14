(function () {
  'use strict';

  /** @ngInject */
  function NavigationDirective() {
    return {
      templateUrl: 'app/navigation/navigation.html'
    };
  }

  angular
    .module('microServicesGui')
    .directive('msgNavigation', NavigationDirective);



}());
