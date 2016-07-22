/* global angular, _ */
(function() {
  'use strict';
  angular
    .module('msgGraph')
    .directive('msgD3Graph', MsgD3Graph);

  /** @ngInject */
  function MsgD3Graph(
    d3, $modal, $window, NodeService, NodecolorService, createModalConfig,
    msdEventsService
  ) {
    var eventsService = msdEventsService;
    var margin = { top: 20, right: 0, bottom: 20, left: 0 };
    var width = $window.innerWidth - margin.right - margin.left - 16;
    var height = $window.innerHeight;
    var minheight = $window.innerHeight;
    var linkedByIndex = {};
    var data;
    var graph;
    var layout;
    var links;
    var nodes;
    var element;
    var titleFontSize;
    var textFontSize;
    var verticalNodeSpace = 75;
    var verticalNodeSpaceRect = 25;
    var paddingAfterTitles = 10;
    // for circles
    var nodeR = 16;
    // for rects
    var nodeWidth = 140;
    var nodeHeight = 20;
    var onNodeMouseDown;
    function findConnectedNodes(currentNode) {
      var connectedNodes = [currentNode];
      data.links.forEach(function(link) {
        if (link.source.id === currentNode.id) {
          connectedNodes.push(link.target);
        } else if (link.target.id === currentNode.id) {
          connectedNodes.push(link.source);
        }
      });
      return connectedNodes;
    }
    function fadeUnrelatedNodes(d, opacity, nodes, links) {
      var connectedNodes = findConnectedNodes(d);
      nodes.style('stroke-opacity', function(node) {
        if (connectedNodes.indexOf(node) > -1) {
          return 1;
        }
        return opacity;
      });

      links.style('opacity', function(link) {
        if (link.source.id === connectedNodes[0].id && connectedNodes.indexOf(link.target)) {
          return 1;
        } else if (link.target.id === connectedNodes[0].id && connectedNodes.indexOf(link.source)) {
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

    // Helpers
    function formatClassName(prefix, object) {
      if (object.id) {
        return prefix + '-' + object.id.replace(/(\.|\/|:)/gi, '-');
      }
    }

    function findElementByNode(prefix, node) {
      var selector = '.' + formatClassName(prefix, node);
      return graph.select(selector);
    }

    /*
     Mouse events
     */

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

    function onLinkMouseDown() {

    }

    function determineFontSize() {
      switch (true) {
        case (width >= 0 && width < 480):
          titleFontSize = 12;
          textFontSize = 6;
          break;
        case (width >= 480 && width < 640):
          titleFontSize = 18;
          textFontSize = 8;
          break;
        // case (width > width):
        //   titleFontSize = 22;
        //   textFontSize = 10;
        //   break;
        default:
          break;
      }
    }

    function countNodesByLane(nodes) {
      var counts = [0, 0, 0, 0];
      nodes.forEach(function(n) {
        counts[n.lane]++;
      });
      return counts;
    }

    function getGraphHeight(data) {
      var numberOfNodes = 0;
      var numberOfNodesByLane = countNodesByLane(data.nodes);

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

    function renderGraph(data) {
      var eventsList = msdEventsService.getIndexedList();
      var laneLength = data.lanes.length;
      // tooltip
      var tooltip = graph
        .append('svg:text')
        .attr('class', 'svgtooltip');

      var uiCounter = 0;
      var epCounter = 0;
      var microCounter = 0;
      var dbCounter = 0;

      var x1 = d3.scale.linear()
        .domain([0, laneLength])
        .range([margin.left, width]);

      // Update data
      for (var i = 0; i < data.nodes.length; i++) {
        var node = data.nodes[i];
        node.index = i;
        node.x = x1(node.lane + 0.5);
        switch (node.lane) {
          case 0:
            uiCounter++;
            node.y = verticalNodeSpace * uiCounter + paddingAfterTitles;
            break;
          case 1:
            node.x = x1(node.lane + 0.5) + (nodeWidth / 2);
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

      // Lane Titles
      graph.append('svg:g')
        .selectAll('.label')
        .data(data.lanes)
        .enter()
        .append('svg:text')
        .text(function(d) {
          return d.type;
        })
        .attr('x', function(d, i) {
          return x1(i + 0.5);
        })
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'lane-title')
        .style('font-size', titleFontSize);

      // Circle Marker Arrows
      graph.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', nodeR + 9 + 2)
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
        .on('click', onLinkMouseDown)
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
        .on('click', onLinkMouseDown)
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
          return formatClassName('node', d);
        });

      // Circles
      var circles = nodes
        .filter(function(d) {
          return d.lane !== 1;
        });

      circles
        .append('svg:circle')
        .attr('r', nodeR / 1.5)
        .attr('cx', function(d) {
          return d.x + (nodeR * 1.6);
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

        }, this, nodes, links));

      circles.append('svg:text')
        .attr('x', function(d) {
          return d.x + (nodeR * 1.6);
        })
        .attr('y', function(d) {
          return d.y + nodeR / 2 - nodeR / 4;
        })
        .text(function(d) {
          var nodeEvents = msdEventsService.getEventsByNodeId(d.id);
          if (nodeEvents) {
            return nodeEvents.events.length;
          }
          return 0;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize - 6);

      circles
        .append('svg:circle')
        .attr('class', function(d) {
          return formatClassName('circle', d);
        })
        .attr('r', nodeR)
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
        .attr('r', nodeR / 1.5)
        .attr('cx', function(d) {
          return d.x + (nodeR);
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

        }, this, nodes, links));
      rects
        .append('svg:text')
        .attr('x', function(d) {
          return d.x + nodeR;
        })
        .attr('y', function(d) {
          return d.y + nodeR / 2 - nodeR / 4;
        })
        .text(function(d) {
          var nodeEvents = msdEventsService.getEventsByNodeId(d.id);
          if (nodeEvents) {
            return nodeEvents.events.length;
          }
          return 0;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize - 6);
      rects.append('svg:rect')
        .attr('class', function(d) {
          return formatClassName('circle', d);
        })
        // .attr("r", nodeR)
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
          return x1(d.lane + 0.5);
        })
        .attr('y', function(d) {
          return d.y + (d.lane === 1 ? 4 : 25);
        })
        .attr('class', function(d) {
          return 'shadow ' + formatClassName('text', d);
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
          return formatClassName('text', d);
        })
        .attr('x', function(d) {
          return x1(d.lane + 0.5);
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


      // Lanes
      // graph.append('svg:g')
      //   .selectAll('.lane')
      //   .data(data.lanes)
      //   .enter()
      //   .append('svg:line')
      //   .attr('class', 'lane')
      //   .attr('x1', function(d) {
      //     return x1(d.lane);
      //   })
      //   .attr('x2', function(d) {
      //     return x1(d.lane);
      //   })
      //   .attr('y1', 0)
      //   .attr('y2', height)
      //   .style('visibility', function(d, i) {
      //     return i === 0 ? null : 'visible';
      //   });

      // Build linked index
      data.links
        .forEach(function(d) {
          linkedByIndex[d.source.index + ',' + d.target.index] = 1;
        });
    }

    function render(element) {
      height = getGraphHeight(data);

      d3.select('svg').remove();

      graph = d3.select(element).append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height)
        .append('g');

      layout = d3.layout.force()
        .size([width, height]);

      determineFontSize();
      renderGraph(data);
    }

    function showTheDetails(node) {
      NodeService.setSelectedNode(node);
      var modalConfig = createModalConfig(node.lane);
      var modalInstance = $modal.open(modalConfig);

      modalInstance
        .result
        .then(function(updates) {
          NodeService.updateNode(updates);
          render(element);
        });
    }

    onNodeMouseDown = function onNodeMouseDown(d) {
      d.fixed = true;
      d3.select(this).classed('sticky', true);
      showTheDetails(d);
    };

    function resize() {
      width = $window.innerWidth - margin.right - margin.left;
      height = $window.innerHeight;

      graph
        .attr('width', width)
        .attr('height', height);

      d3.select('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height);

      render(element);
    }

    // function formatLinkNameByIndex(prefix, object) {
    //    return prefix + '-' + object.source + '-' + object.target;
    // }

    // function formatLinkNameByObject(prefix, object) {
    //    return prefix + '-' + object.source.index + '-' + object.target.index;
    // }

    // function findElementByLink(prefix, link) {
    //    var selector = '#' + formatLinkNameByObject(prefix, link);
    //    return graph.select(selector);
    // }

    // function isConnected(a, b) {
    //    //return linkedByIndex[a.index + "," + b.index]
    //    // || linkedByIndex[b.index + "," + a.index]
    //    // || a.index === b.index;
    //    if (a.index === b.index) {
    //        return true;
    //    }
    //    var connected = false;
    //    data.links.forEach(function (d) {
    //        if ((d.source === a && d.target === b) || (d.source === b && d.target === a)) {
    //            connected = true;
    //        }
    //    });
    //    return connected;
    // }

    return {
      restrict: 'A',
      scope: {
        graphData: '='
      },
      link: function(scope, elem) {
        element = elem[0];
        d3.select($window).on('resize', resize); // Adds or removes an event listener to each element in the current selection, for the specified type.
        scope.$watch('graphData', function(newVal) {
          // todo do an object equality check with lodash or keep $watch eqaulity check?
          if (newVal) {
            data = newVal;
            render(element);
          }
        }, true);
      }
    };
  }
})();
