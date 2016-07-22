/* global angular, _ */
(function() {
  'use strict';
  angular
    .module('msgGraph')
    .directive('msgD3Graph', MsgD3Graph);

  /** @ngInject */
  function MsgD3Graph(
    d3, $modal, $window, NodeService, NodecolorService, createModalConfig,
    msdEventsService, createEventModalConfig, helpers, GraphService, msdVisuals
  ) {
    // graph box
    var margin = { top: 20, right: 0, bottom: 20, left: 0 };
    var width = $window.innerWidth - margin.right - margin.left - 16;
    var height = $window.innerHeight;
    var minheight = $window.innerHeight;

    var data;
    var graph;
    var layout;
    var links;
    var nodes;
    var element;

    // fontsizes
    var titleFontSize;
    var textFontSize;

    // node positioning
    var verticalNodeSpace = 75;
    var verticalNodeSpaceRect = 30;
    var paddingAfterTitles = 10;

    // circles render settings
    var nodeRadius = 16;

    // rectangle render settings
    var nodeWidth = 240;
    var nodeHeight = 20;

    function findElementByNode(prefix, node) {
      var selector = '.' + helpers.formatClassName(prefix, node);
      return graph.select(selector);
    }

    /*
     Mouse events
     */
    function onEventCircleMouseDown(node) {
      if (node.nodeEvents) {
        var modalConfig = createEventModalConfig(node.nodeEvents);
        var modalInstance = $modal.open(modalConfig);

        modalInstance
          .result
          .then();
      }
    }

    function onNodeMouseOver(nodes, links, d) {
      var elm = findElementByNode('circle', d);
      elm.style('fill', fillColor(d));

      fadeUnrelatedNodes(d, 0.2, nodes, links);
    }

    function onNodeMouseOut(nodes, links, d) {
      var elm = findElementByNode('circle', d);
      elm.style('fill', null);

      fadeUnrelatedNodes(d, 1, nodes, links);
    }

    function onNodeMouseDown(node) {
      node.fixed = true;
      d3.select(this).classed('sticky', true);
      NodeService.setSelectedNode(node);
      var modalConfig = createModalConfig(node.lane);
      var modalInstance = $modal.open(modalConfig);

      modalInstance
        .result
        .then(function(updates) {
          NodeService.updateNode(updates);
          renderGraph();
        });
    }

    function fadeUnrelatedNodes(d, opacity, nodes, links) {
      var connectedNodes = NodeService.getConnectedNodes(data.links, d);
      nodes
        .style('stroke-opacity', function(node) {
          if (connectedNodes.indexOf(node) > -1) {
            return 1;
          }
          return opacity;
        });

      links
        .style('opacity', function(link) {
          if (link.source.id === d.id && connectedNodes.indexOf(link.target)) {
            return 1;
          } else if (link.target.id === d.id && connectedNodes.indexOf(link.source)) {
            return 1;
          }
          return opacity;
        });
    }

    function fillColor(o) {
      if (o.details !== undefined) {
        return NodecolorService.getColorFor(o.details.type);
      }
    }

    function determineFontSize(width) {
      var title;
      var text;

      if (width >= 0 && width < 480) {
        title = 12;
        text = 6;
      } else if (width >= 480 && width < 640) {
        title = 18;
        text = 8;
      }

      return {
        titleFontSize: title || 22,
        textFontSize: text || 14
      };
    }

    function getGraphHeight(data) {
      var numberOfNodes = 0;
      var numberOfNodesByLane = GraphService.countNodesByLane(data.nodes);

      numberOfNodesByLane.forEach(function(count, index) {
        count++;
        if (index === 1) {
          count = Math.round(count * (verticalNodeSpaceRect / verticalNodeSpace));
        }
        if (count > numberOfNodes) {
          numberOfNodes = count;
        }
      });

      if (numberOfNodes * verticalNodeSpace > minheight) {
        return numberOfNodes * verticalNodeSpace;
      }
      return minheight;
    }

    function renderGraph() {
      var laneCount = data.lanes.length;
      var uiCounter = 0;
      var epCounter = 0;
      var microCounter = 0;
      var dbCounter = 0;
      var fontsizes = determineFontSize(width);

      titleFontSize = fontsizes.titleFontSize;
      textFontSize = fontsizes.textFontSize;
      height = getGraphHeight(data);

      d3.select('svg')
        .remove();

      layout = d3.layout
        .force()
        .size([width, height]);

      graph = d3.select(element)
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height)
        .append('g');

      // tooltip
      var tooltip = graph
        .append('svg:text')
        .attr('class', 'svgtooltip');

      var xScale = d3.scale
        .linear()
        .domain([0, laneCount])
        .range([margin.left, width]);

      // Set node position
      for (var i = 0; i < data.nodes.length; i++) {
        var node = data.nodes[i];
        node.index = i;
        node.x = xScale(node.lane + 0.5);
        switch (node.lane) {
          case 0:
            uiCounter++;
            node.y = verticalNodeSpace * uiCounter + paddingAfterTitles;
            break;
          case 1:
            node.x = xScale(node.lane + 0.5) + (nodeWidth / 2);
            node.y = (verticalNodeSpaceRect * epCounter) + verticalNodeSpace + paddingAfterTitles;
            epCounter++;
            break;
          case 2:
            microCounter++;
            node.y = verticalNodeSpace * microCounter + paddingAfterTitles;
            break;
          case 3:
            dbCounter++;
            node.y = verticalNodeSpace * dbCounter + paddingAfterTitles;
            break;
          default:
            break;
        }
      }

      msdVisuals.drawLaneTitles(graph, data.lanes);

      // Circle Marker Arrows
      graph.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', nodeRadius + 9 + 2)
        .attr('refY', 0.0)
        .attr('markerWidth', 60)
        .attr('markerHeight', 6)
        .attr('class', 'link')
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

      // Rect marker arrows
      graph.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'arrow-rect')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 9)
        .attr('refY', 0.0)
        .attr('markerWidth', 60)
        .attr('markerHeight', 6)
        .attr('class', 'link')
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

      var lineFunction = d3.svg.line()
        .x(function(d) {
          return d.x;
        })
        .y(function(d) {
          return d.y;
        })
        .interpolate('basis');

      links = graph.append('svg:g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', function(l) {
          var sourceNode = data.nodes.filter(function(d, i) {
            return i === l.source.index;
          })[0];
          var targetNode = data.nodes.filter(function(d, i) {
            return i === l.target.index;
          })[0];
          if (sourceNode.lane === targetNode.lane) {
            var curve = {
              x: targetNode.x + 100,
              y: (targetNode.y + sourceNode.y) / 2
            };
            return lineFunction([sourceNode, curve, targetNode]);
          }
          if (targetNode.lane === 1) {
            var position = {
              x: targetNode.x - nodeWidth - 5,
              y: targetNode.y
            };
            return lineFunction([sourceNode, position]);
          }
          return lineFunction([sourceNode, targetNode]);
        })
        .attr('pointer-events', 'none')
        .attr('marker-end', function(x) {
          if (x.target.lane === 1) {
            return 'url(#arrow-rect)';
          }
          return 'url(#arrow)';
        });

      graph.append('svg:g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('path')
        .attr('class', 'clickablelink')
        .attr('d', function(l) {
          var sourceNode = data.nodes.filter(function(d, i) {
            return i === l.source.index;
          })[0];
          var targetNode = data.nodes.filter(function(d, i) {
            return i === l.target.index;
          })[0];
          if (sourceNode.lane === targetNode.lane) {
            var curve = {
              x: targetNode.x + 100,
              y: (targetNode.y + sourceNode.y) / 2
            };
            return lineFunction([sourceNode, curve, targetNode]);
          }
          if (targetNode.lane === 1) {
            var position = {
              x: targetNode.x - nodeWidth - 5,
              y: targetNode.y
            };
            return lineFunction([sourceNode, position]);
          }
          return lineFunction([sourceNode, targetNode]);
        })
        .attr('pointer-events', 'stroke')
        .on('mouseover', function(d) {
          tooltip.text(d.source.id + ' - ' + d.target.id);
          return tooltip.style('opacity', '1');
        })
        .on('mousemove', function() {
          var coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          return tooltip.attr('x', (x + 15) + 'px').attr('y', (y + 20) + 'px');
        })
        .on('mouseout', function() {
          return tooltip.style('opacity', '0');
        });

      // Nodes
      nodes = graph.append('svg:g')
        .selectAll('node')
        .data(data.nodes)
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .call(layout.drag)
        .attr('id', function(d) {
          return helpers.formatClassName('node', d);
        });

      // Circles
      var circles = nodes
        .filter(function(d) {
          return d.lane !== 1;
        });

      circles
        .append('svg:circle')
        .attr('r', nodeRadius / 1.5)
        .attr('cx', function(d) {
          return d.x + (nodeRadius * 1.6);
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .style('stroke-width', 1)
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mouseover', _.bind(function() {

        }, this, nodes, links))
        .on('mouseout', _.bind(function() {

        }, this, nodes, links))
        .on('mousedown', _.bind(onEventCircleMouseDown));

      circles.append('svg:text')
        .attr('x', function(d) {
          return d.x + (nodeRadius * 1.6);
        })
        .attr('y', function(d) {
          return d.y + nodeRadius / 2 - nodeRadius / 4;
        })
        .text(function(d) {
          var nodeEvents = msdEventsService.getEventsByNodeId(d.id);
          if (nodeEvents) {
            if (nodeEvents.nodeId === d.id) {
              d.nodeEvents = nodeEvents;
              return nodeEvents.events.length;
            }
          }
          return 0;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize - 6);

      circles
        .append('svg:circle')
        .attr('class', function(d) {
          return helpers.formatClassName('circle', d);
        })
        .attr('r', nodeRadius)
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .on('mouseover', _.bind(onNodeMouseOver, this, nodes, links))
        .on('mouseout', _.bind(onNodeMouseOut, this, nodes, links))
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mousedown', onNodeMouseDown);
      // .style("stroke-width", 5)
      // .style("fill", '#ffffff');

      // Rectangles
      var rects = nodes.filter(function(d) {
        return d.lane === 1;
      });
      rects
        .append('svg:circle')
        .attr('r', nodeRadius / 1.5)
        .attr('cx', function(d) {
          return d.x + (nodeRadius);
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .style('stroke-width', 1)
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mouseover', _.bind(function() {

        }, this, nodes, links))
        .on('mouseout', _.bind(function() {

        }, this, nodes, links))
        .on('mousedown', _.bind(onEventCircleMouseDown));

      rects
        .append('svg:text')
        .attr('x', function(d) {
          return d.x + nodeRadius;
        })
        .attr('y', function(d) {
          return d.y + nodeRadius / 2 - nodeRadius / 4;
        })
        .text(function(d) {
          var nodeEvents = msdEventsService.getEventsByNodeId(d.id);
          if (nodeEvents) {
            d.nodeEvents = nodeEvents;
            return nodeEvents.events.length;
          }
          return 0;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize - 6);
      rects.append('svg:rect')
        .attr('class', function(d) {
          return helpers.formatClassName('circle', d);
        })
        // .attr("r", nodeRadius)
        .attr('x', function(d) {
          return d.x - nodeWidth;
        })
        .attr('y', function(d) {
          return d.y - (nodeHeight / 2);
        })
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .on('mouseover', _.bind(onNodeMouseOver, this, nodes, links))
        .on('mouseout', _.bind(onNodeMouseOut, this, nodes, links))
        .on('mousedown', onNodeMouseDown)
        .style('stroke', function(o) {
          return fillColor(o);
        });

      // A copy of the text with a thick white stroke for legibility.
      nodes.append('svg:text')
        .attr('x', function(d) {
          return xScale(d.lane + 0.5);
        })
        .attr('y', function(d) {
          return d.y + (d.lane === 1 ? 4 : 25);
        })
        .attr('class', function(d) {
          return 'shadow ' + helpers.formatClassName('text', d);
        }).text(function(d) {
          var name = d.details.name ? d.details.name : d.id;
          if (d.details.virtual === true) {
            name += ' (virtual)';
          }
          return name;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize);

      nodes.append('svg:text')
        .attr('class', function(d) {
          return helpers.formatClassName('text', d);
        })
        .attr('x', function(d) {
          return xScale(d.lane + 0.5);
        })
        .attr('y', function(d) {
          return d.y + (d.lane === 1 ? 4 : 25);
        })
        .text(function(d) {
          var name = d.details.name ? d.details.name : d.id;
          if (d.details.virtual === true) {
            name += ' (virtual)';
          }
          return name;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize);
    }

    function resize() {
      width = $window.innerWidth - margin.right - margin.left;
      height = $window.innerHeight;

      graph
        .attr('width', width)
        .attr('height', height);

      d3.select('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height);

      renderGraph();
    }

    return {
      restrict: 'A',
      scope: {
        graphData: '='
      },
      link: function(scope, elem) {
        element = elem[0];
        d3.select($window).on('resize', resize); // Adds or removes an event listener to each element in the current selection, for the specified type.
        scope.$watch('graphData', function(newVal) {
          if (newVal) {
            data = newVal;
            renderGraph();
          }
        }, true);
      }
    };
  }
})();
