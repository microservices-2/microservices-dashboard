/* global angular */
(function() {
  'use strict';
  angular
    .module('msgGraph')
    .directive('msgD3Graph', MsgD3Graph);

  /** @ngInject */
  function MsgD3Graph(d3, $modal, $window, msdVisuals) {
    return {
      restrict: 'A',
      scope: {
        graphData: '='
      },
      link: function(scope, elem) {
        var element = elem[0];
        scope.$watch('graphData', function(newGraphData) {
          if (newGraphData) {
            msdVisuals.renderGraph(newGraphData, element);
          }
        }, true);
      }
    };
  }
})();
