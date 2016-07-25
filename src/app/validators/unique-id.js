/* global angular */
(function() {
  'use strict';

  angular
    .module('microServicesGui')
    .directive('uniqueId', Directive);

  Directive.$inject = ['$q', '$http', 'BASE_URL'];
  function Directive($q, $http, BASE_URL) {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      require: 'ngModel',
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$asyncValidators.uniqueId = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        var deferred = $q.defer();

        $http
          .get(BASE_URL + 'graph')
          .then(function(response) {
            if (response.data) {
              var nodes = response.data.nodes;
              var idSet = nodes.reduce(function(state, node) {
                if (state.indexOf(node.id) === -1) {
                  state.push(node.id);
                }
                return state;
              }, []);
              if (idSet.indexOf(value) === -1) {
                deferred.resolve();
              }
              deferred.reject();
            }
          });

        return deferred.promise;
      };
    }
  }
})();
