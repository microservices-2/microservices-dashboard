/* global angular */
(function() {
  'use strict';

  angular
    .module('msgGraph')
    .service('msdVisuals', Service);

  Service.$inject = ['d3', '$window'];
  function Service(d3, $window) {
    var self = this;

    self.drawLaneTitles = drawLaneTitles;

    var margin = { top: 20, right: 0, bottom: 20, left: 0 };
    var width = $window.innerWidth - margin.right - margin.left - 16;
    var laneCount = 4;
    var titleFontSize = 16;
    var xScale = d3.scale
      .linear()
      .domain([0, laneCount])
      .range([margin.left, width]);

    // //////////////
    function drawLaneTitles(graph, lanes) {
      graph.append('svg:g')
        .selectAll('.label')
        .data(lanes)
        .enter()
        .append('svg:text')
        .text(function(d) {
          return d.type;
        })
        .attr('x', function(d, i) {
          return xScale(i + 0.5);
        })
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'lane-title')
        .style('font-size', titleFontSize);
    }
  }
})();
