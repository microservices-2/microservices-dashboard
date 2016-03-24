(function(){
    'use strict';

    angular
        .module('microServicesGui')
        .directive('loader', function() {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'app/loader/loader.directive.html'
            };
        });
})();