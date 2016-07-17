/* global angular*/

(function() {
  'use strict';

  /** @ngInject */
  function config($logProvider, $httpProvider) {
    // enable log debug
    $logProvider.debugEnabled(true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }

  angular
    .module('microServicesGui')
    .config(config);
})();
