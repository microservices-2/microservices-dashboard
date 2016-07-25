/* global angular _ */
(function() {
  'use strict';

  angular
    .module('msgGraph')
    .service('msdVisuals', Service);

  Service.$inject = ['d3', '$window', 'helpers', 'NodecolorService', 'createEventModalConfig', '$modal', 'msdEventsService', 'NodeService', 'createModalConfig', 'GraphService'];
  function Service(d3, $window, helpers, NodecolorService, createEventModalConfig, $modal, msdEventsService, NodeService, createModalConfig, GraphService) {
    var self = this;
    self.renderGraph = renderGraph;
    self.isRendered = false;
    self.reDraw = reDraw;
    // //////////////
    d3.select($window).on('resize', resize); // Adds or removes an event listener to each element in the current selection, for the specified type.

    // visual elements
    var _element;
    var _layout;

    var _d3GraphSvg;
    var _d3lines;
    var _d3CircleNodes;
    var _d3RectNodes;
    var _d3Nodes;

    // graph data
    var _graphData;
    var _nodes;
    var _links;
    var _uiCounter = 0;
    var _epCounter = 0;
    var _microCounter = 0;
    var _dbCounter = 0;

    // positioning and dimensions
    var _nodeRadius = 16;
    var _verticalNodeSpace = 75;
    var _verticalNodeSpaceRect = 30;
    var _paddingAfterTitles = 10;

    var _nodeWidth = 240;
    var _nodeHeight = 20;

    var _margin = { top: 20, right: 0, bottom: 20, left: 0 };
    var _width = $window.innerWidth - _margin.right - _margin.left - 16;
    var _minheight = $window.innerHeight;
    var _height = $window.innerHeight;
    var DEFAULT_TITLE_FONT_SIZE = 22;
    var DEFAULT_TEXT_FONT_SIZE = 12;
    var EVENT_COUNT_FONT_SIZE = 10;
    var _titleFontSize;
    var _textFontSize;
    var _xScale;

    function reDraw() {
      renderGraph(GraphService.getGraph(), _element);
    }

    function renderGraph(data, element) {
      self.isRendered = true;
      _graphData = data;
      _element = element;
      _nodes = data.nodes;
      _links = data.links;

      _uiCounter = 0;
      _epCounter = 0;
      _microCounter = 0;
      _dbCounter = 0;

      var fontsizes = determineFontSize(_width);
      _titleFontSize = fontsizes.titleFontSize;
      _textFontSize = fontsizes.textFontSize;

      _height = getGraphHeight(data);

      d3.select('svg')
        .remove();

      _layout = d3.layout
        .force()
        .size([_width, _height]);

      _d3GraphSvg = d3.select(element)
        .append('svg')
        .attr('width', _width + _margin.right + _margin.left)
        .attr('height', _height)
        .append('g');

      _xScale = d3.scale
        .linear()
        .domain([0, data.lanes.length])
        .range([_margin.left, _width]);

      drawLaneTitles();
      defineMarkerArrows();
      defineRectangleArrows();
      setNodePositions();
      drawLinks();
      drawNodes();
      drawLables();
    }
    function drawNodes() {
      setNodes();
      drawCircleNodes();
      drawRectangleNodes();
    }
    function getGraphHeight() {
      var numberOfNodes = 0;
      var numberOfNodesByLane = GraphService.countNodesByLane(_nodes);

      numberOfNodesByLane.forEach(function(count, index) {
        count++;
        if (index === 1) {
          count = Math.round(count * (_verticalNodeSpaceRect / _verticalNodeSpace));
        }
        if (count > numberOfNodes) {
          numberOfNodes = count;
        }
      });

      if (numberOfNodes * _verticalNodeSpace > _minheight) {
        return numberOfNodes * _verticalNodeSpace;
      }
      return _minheight;
    }
    function setNodePositions() {
      for (var i = 0; i < _nodes.length; i++) {
        var node = _nodes[i];
        node.index = i;
        node.x = _xScale(node.lane + 0.5);
        switch (node.lane) {
          case 0:
            _uiCounter++;
            node.y = _verticalNodeSpace * _uiCounter + _paddingAfterTitles;
            break;
          case 1:
            node.x = _xScale(node.lane + 0.5) + (_nodeWidth / 2);
            node.y = (_verticalNodeSpaceRect * _epCounter) + _verticalNodeSpace + _paddingAfterTitles;
            _epCounter++;
            break;
          case 2:
            _microCounter++;
            node.y = _verticalNodeSpace * _microCounter + _paddingAfterTitles;
            break;
          case 3:
            _dbCounter++;
            node.y = _verticalNodeSpace * _dbCounter + _paddingAfterTitles;
            break;
          default:
            break;
        }
      }
    }
    function resize() {
      _width = $window.innerWidth - _margin.right - _margin.left;
      _height = $window.innerHeight;

      _d3GraphSvg
        .attr('width', _width)
        .attr('height', _height);

      d3.select('svg')
        .attr('width', _width + _margin.right + _margin.left)
        .attr('height', _height);

      renderGraph(_graphData, _element);
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
        titleFontSize: title || DEFAULT_TITLE_FONT_SIZE,
        textFontSize: text || DEFAULT_TEXT_FONT_SIZE
      };
    }
    function fillColor(o) {
      if (o.details !== undefined) {
        return NodecolorService.getColorFor(o.details.type);
      }
    }
    /*
     Mouse events
     */
    function onEventCircleMouseDown(node) {
      var modalConfig = createEventModalConfig(node);
      $modal.open(modalConfig);
    }

    function fadeUnrelatedNodes(d, opacity) {
      var connectedNodes = NodeService.getConnectedNodes(_links, d);
      _d3Nodes
        .style('stroke-opacity', function(node) {
          if (connectedNodes.indexOf(node) > -1) {
            return 1;
          }
          return opacity;
        });

      _d3lines
        .style('opacity', function(link) {
          if (link.source.id === d.id && connectedNodes.indexOf(link.target)) {
            return 1;
          } else if (link.target.id === d.id && connectedNodes.indexOf(link.source)) {
            return 1;
          }
          return opacity;
        });
    }

    function findElementByNode(prefix, node) {
      var selector = '.' + helpers.formatClassName(prefix, node);
      return _d3GraphSvg.select(selector);
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
          renderGraph(_graphData, _element);
        });
    }
    function drawLables() {
      _d3Nodes.append('svg:text')
        .attr('x', function(d) {
          return _xScale(d.lane + 0.5);
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
        .style('font-size', _textFontSize);

      _d3Nodes.append('svg:text')
        .attr('class', function(d) {
          return helpers.formatClassName('text', d);
        })
        .attr('x', function(d) {
          return _xScale(d.lane + 0.5);
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
        .style('font-size', _textFontSize);
    }
    function drawRectangleNodes() {
      _d3RectNodes = _d3Nodes.filter(function(d) {
        return d.lane === 1;
      });
      // event count circles
      _d3RectNodes
        .append('svg:circle')
        .attr('r', _nodeRadius / 1.5)
        .attr('cx', function(d) {
          return d.x + 12;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .style('stroke-width', 1)
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mousedown', _.bind(onEventCircleMouseDown));

      // event count text
      _d3RectNodes
        .append('svg:text')
        .attr('x', function(d) {
          return d.x + 12;
        })
        .attr('y', function(d) {
          return d.y + 4;
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
        .style('font-size', EVENT_COUNT_FONT_SIZE);

      _d3RectNodes.append('svg:rect')
        .attr('class', function(d) {
          return helpers.formatClassName('circle', d);
        })
        .attr('x', function(d) {
          return d.x - _nodeWidth;
        })
        .attr('y', function(d) {
          return d.y - (_nodeHeight / 2);
        })
        .attr('width', _nodeWidth)
        .attr('height', _nodeHeight)
        .on('mouseover', _.bind(onNodeMouseOver, this, _d3Nodes, _d3lines))
        .on('mouseout', _.bind(onNodeMouseOut, this, _d3Nodes, _d3lines))
        .on('mousedown', onNodeMouseDown)
        .style('stroke', function(o) {
          return fillColor(o);
        });
    }

    function drawCircleNodes() {
      _d3CircleNodes = _d3Nodes
        .filter(function(d) {
          return d.lane !== 1;
        });

      // event count circles
      _d3CircleNodes
        .append('svg:circle')
        .attr('r', _nodeRadius / 1.5)
        .attr('cx', function(d) {
          return d.x + 28;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .style('stroke-width', 1)
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mousedown', _.bind(onEventCircleMouseDown));

      // event count text
      _d3CircleNodes
        .append('svg:text')
        .attr('x', function(d) {
          return d.x + 28;
        })
        .attr('y', function(d) {
          return d.y + 3;
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
        .style('font-size', EVENT_COUNT_FONT_SIZE);

      _d3CircleNodes
        .append('svg:circle')
        .attr('class', function(d) {
          return helpers.formatClassName('circle', d);
        })
        .attr('r', _nodeRadius)
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        })
        .on('mouseover', _.bind(onNodeMouseOver, this, _d3Nodes, _d3lines))
        .on('mouseout', _.bind(onNodeMouseOut, this, _d3Nodes, _d3lines))
        .style('stroke', function(o) {
          return fillColor(o);
        })
        .on('mousedown', onNodeMouseDown);
    }

    function setNodes() {
      _d3Nodes = _d3GraphSvg.append('svg:g')
        .selectAll('node')
        .data(_nodes)
        .enter()
        .append('svg:g')
        .attr('class', 'node')
        .call(_layout.drag)
        .attr('id', function(d) {
          return helpers.formatClassName('node', d);
        });
    }

    function drawLinks() {
      var lineFunction = d3.svg.line()
        .x(function(d) {
          return d.x;
        })
        .y(function(d) {
          return d.y;
        })
        .interpolate('basis');

      var tooltip = _d3GraphSvg
        .append('svg:text')
        .attr('class', 'svgtooltip');

      _d3lines = _d3GraphSvg.append('svg:g')
        .selectAll('line')
        .data(_links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', function(l) {
          var sourceNode = _nodes.filter(function(d, i) {
            return i === l.source.index;
          })[0];
          var targetNode = _nodes.filter(function(d, i) {
            return i === l.target.index;
          })[0];
          if (sourceNode.lane === undefined || targetNode.lane === undefined) {
            debugger;
          }
          if (sourceNode.lane === targetNode.lane) {
            var curve = {
              x: targetNode.x + 100,
              y: (targetNode.y + sourceNode.y) / 2
            };
            return lineFunction([sourceNode, curve, targetNode]);
          }
          if (targetNode.lane === 1) {
            var position = {
              x: targetNode.x - _nodeWidth - 5,
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

      _d3GraphSvg.append('svg:g')
        .selectAll('line')
        .data(_links)
        .enter()
        .append('path')
        .attr('class', 'clickablelink')
        .attr('d', function(l) {
          var sourceNode = _nodes.filter(function(d, i) {
            return i === l.source.index;
          })[0];
          var targetNode = _nodes.filter(function(d, i) {
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
              x: targetNode.x - _nodeWidth - 5,
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
    }

    function defineRectangleArrows() {
      _d3GraphSvg.append('svg:defs')
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
    }

    function defineMarkerArrows() {
      _d3GraphSvg.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', _nodeRadius + 9 + 2)
        .attr('refY', 0.0)
        .attr('markerWidth', 60)
        .attr('markerHeight', 6)
        .attr('class', 'link')
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');
    }

    function drawLaneTitles() {
      _d3GraphSvg.append('svg:g')
        .selectAll('.label')
        .data(_graphData.lanes)
        .enter()
        .append('svg:text')
        .text(function(d) {
          return d.type;
        })
        .attr('x', function(d, i) {
          return _xScale(i + 0.5);
        })
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'lane-title')
        .style('font-size', _titleFontSize);
    }
  }
})();
