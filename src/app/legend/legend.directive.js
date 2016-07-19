/* global angular*/
(function() {
  'use strict';
  angular
    .module('microServicesGui')
    .directive('msdLegend', LegendDirective);

  /** @ngInject */
  function LegendCtrl(NodecolorService, GraphService) {
    var legend = this;

    legend.types = undefined;
    legend.getColor = getColor;

    activate();

    function activate() {
      GraphService.getTypes().then(function(data) {
        legend.types = data;
      });
    }

    function getColor(node) {
      return { 'border-color': String(NodecolorService.getColorFor(node)) };
    }
  }

  function LegendDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/legend/legend.html',
      scope: {},
      controllerAs: 'legend',
      bindToController: true,
      controller: LegendCtrl
    };
  }
})();
