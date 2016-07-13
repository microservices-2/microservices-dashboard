(function () {
    'use strict';

// graph module
  function MsgD3Graph(d3, $modal, $window, NodeService, NodecolorService, $log) {

    var margin = {top: 20, right: 0, bottom: 20, left: 0},
      width = $window.innerWidth - margin.right - margin.left - 16,
      height = $window.innerHeight,
      minheight = $window.innerHeight,
      linkedByIndex = {},
      data,
      graph,
      layout,
      links,
      clickableLinks,
      nodes,
      arrowheads,
      element,
      titleFontSize,
      textFontSize,
      verticalNodeSpace = 75,
      verticalNodeSpaceRect = 25,
      paddingAfterTitles = 10,
    //for circles
      nodeR = 16,
    //for rects
      nodeWidth = 140,
      nodeHeight = 20;

    function countNodesByLane(nodes) {
      var counts = [0, 0, 0, 0];
      nodes.forEach(function (n) {
        counts[n.lane]++;
      });
      return counts;
    }

    function getGraphHeight(data) {
      var numberOfNodes = 0,
        biggestLane = 0,
        numberOfNodesByLane = countNodesByLane(data.nodes);

      numberOfNodesByLane.forEach(function (count, lane) {
        if(lane === 1){
          count = Math.ceil(count*(verticalNodeSpaceRect/verticalNodeSpace));
        }
        count++;
        if (count > numberOfNodes) {
          numberOfNodes = count;
          biggestLane = lane;
        }
      });


      if (numberOfNodes * verticalNodeSpace > minheight) {
        return numberOfNodes * verticalNodeSpace;
      } else {
        return minheight;
      }
    }

    function determineFontSize() {
      switch (true) {
        case (0 <= width && width < 480):
          titleFontSize = 12;
          textFontSize = 6;
          break;
        case (480 <= width && width < 640):
          titleFontSize = 18;
          textFontSize = 8;
          break;
        case (640 < width):
          titleFontSize = 22;
          textFontSize = 10;
          break;
      }
    }

    function resize() {
      width = $window.innerWidth - margin.right - margin.left;
      height = $window.innerHeight;

      graph.attr('width', width).attr('height', height);


      d3.select('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height);

      render(element);
    }

    function renderGraph(data) {
      var laneLength = data.lanes.length;

      var uiCounter = 0;
      var epCounter = 0;
      var microCounter = 0;
      var dbCounter = 0;

      var x1 = d3.scale.linear()
        .domain([0, laneLength])
        .range([margin.left, width]);

      //Update data
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
        }
      }

      //Labels
      graph.append('svg:g')
        .selectAll('.label')
        .data(data.lanes)
        .enter()
        .append('svg:text')
        .text(function (d) {
          return d.type;
        })
        .attr('x', function (d, i) {
          return x1(i + 0.5);
        })
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('class', 'lane-title')
        .style('font-size', titleFontSize);

      // tooltip
      var tooltip = graph
        .append('svg:text')
        .attr('class', 'svgtooltip');

      // Build linked index
      data.links
        .forEach(function (d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });

      // Markers
      arrowheads = graph.append('svg:defs')
        .append('svg:marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', nodeR - 5)
        .attr('refY', 0.0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('class', 'link')
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5');

      var lineFunction = d3.svg.line()
        .x(function (d) {
          return d.x;
        })
        .y(function (d) {
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
        .attr('d', function (l) {
          return lineFunction(getPointsArray(l));
        })
        .attr('pointer-events', 'none')
        .attr('marker-end', 'url(#arrow)');

      clickableLinks = graph.append('svg:g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('path')
        .on('click', onLinkMouseDown)
        .attr('class', 'clickablelink')
        .attr('d', function (l) {
          return lineFunction(getPointsArray(l));
        })
        .attr('pointer-events', 'stroke')
        .on('mouseover', function (d) {
          tooltip.text(d.source.id + " - " + d.target.id);
          return tooltip.style('opacity', '1');
        })
        .on('mousemove', function () {
          var coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          return tooltip
            .attr('x', (x + 15) + 'px')
            .attr('y', (y + 20) + 'px');
        })
        .on('mouseout', function () {
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
        .on('mousedown', onNodeMouseDown)
        .attr('id', function (d) {
          return formatClassName('node', d);
        });

      // Circles
      nodes.filter(function (d) {
          return d.lane !== 1;
        })
        .append('svg:circle')
        .attr('class', function (d) {
          return formatClassName('circle', d);
        })
        .attr('r', nodeR)
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        })
        .on('mouseover', _.bind(onNodeMouseOver, this, nodes, links))
        .on('mouseout', _.bind(onNodeMouseOut, this, nodes, links))
        .style('stroke', function (o) {
          return fillColor(o);
        });
      //.style('stroke-width', 5)
      //.style('fill', '#ffffff');

      // Rectangles
      nodes.filter(function (d) {
          return d.lane === 1;
        })
        .append('svg:rect')
        .attr('class', function (d) {
          return formatClassName('circle', d);
        })
        //.attr('r', nodeR)
        .attr('x', function (d) {
          return d.x - nodeWidth;
        })
        .attr('y', function (d) {
          return d.y - (nodeHeight / 2);
        })
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .on('mouseover', _.bind(onNodeMouseOver, this, nodes, links))
        .on('mouseout', _.bind(onNodeMouseOut, this, nodes, links))
        .style('stroke', function (o) {
          return fillColor(o);
        });


      // A copy of the text with a thick white stroke for legibility.
      nodes.append('svg:text')
        .attr('x', function (d) {
          return x1(d.lane + 0.5);
        })
        .attr('y', function (d) {
          return d.y + (d.lane !== 1 ? 25 : 4);
        })
        .attr('class', function (d) {
          return 'shadow ' + formatClassName('text', d);
        }).text(function (d) {
          var name = d.details.name ? d.details.name : d.id;
          if (d.details.virtual === true) {
            name = d.details.name + ' (virtual)';
          }
          return name;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize);

      nodes.append('svg:text')
        .attr('class', function (d) {
          return formatClassName('text', d);
        })
        .attr('x', function (d) {
          return x1(d.lane + 0.5);
        })
        .attr('y', function (d) {
          return d.y + (d.lane !== 1 ? 25 : 4);
        })
        .text(function (d) {
          var name = d.details.name ? d.details.name : d.id;
          if (d.details.virtual === true) {
            name = d.details.name + ' (virtual)';
          }
          return name;
        })
        .attr('text-anchor', 'middle')
        .style('font-size', textFontSize);


      //Lanes
      graph.append('svg:g')
        .selectAll('.lane')
        .data(data.lanes)
        .enter()
        .append('svg:line')
        .attr('class', 'lane')
        .attr('x1', function (d) {
          return x1(d.lane);
        })
        .attr('x2', function (d) {
          return x1(d.lane);
        })
        .attr('y1', 0)
        .attr('y2', height)
        .style('visibility', function (d, i) {
          return i === 0 ? null : 'visible';
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

      d3.select($window).on('resize', resize); //Adds or removes an event listener to each element in the current selection, for the specified type.
      determineFontSize();
      renderGraph(data);
    }

    function getPointsArray(l){
      var sourceNode = data.nodes.filter(function (d, i) {
        return i === l.source.index;
      })[0];
      var targetNode = data.nodes.filter(function (d, i) {
        return i === l.target.index;
      })[0];

      // Helpers
      function formatClassName(prefix, object) {
        return prefix + '-' + object.id.replace(/(\.|\/|:)/gi, '-');
      }

      function findElementByNode(prefix, node) {
        var selector = '.' + formatClassName(prefix, node);
        return graph.select(selector);
      }

      function fillColor(o) {

        if (o.details !== undefined) {
          return NodecolorService.getColorFor(o.details.type);
        }

      }

      function findConnectedNodes(currentNode) {
        var connectedNodes = [currentNode];
        data.links.forEach(function (link) {
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
        nodes.style('stroke-opacity', function (node) {
          if (connectedNodes.indexOf(node) > -1) {
            return 1;
          } else {
            return opacity;
          }
        });

        links.style('opacity', function (link) {
          if (link.source.id === connectedNodes[0].id && connectedNodes.indexOf(link.target)) {
            return 1;
          } else if (link.target.id === connectedNodes[0].id && connectedNodes.indexOf(link.source)) {
            return 1;
          } else {
            return opacity;
          }
        });
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

      function showTheDetails(node) {
        NodeService.setNode(node);
        var modalInstance = $modal.open({
          templateUrl: 'app/nodemodal/nodemodal.html',
          controller: 'NodeModalController',
          resolve: {
            currentLane: function () {
              return node.lane;
            }
          }
        });

        modalInstance.result.then(function (node) {
          NodeService.pushNode(node);
          render(element);
        }, function () {
          render(element);
        });
      }

      function onNodeMouseDown(d) {
        d.fixed = true;
        d3.select(this).classed('sticky', true);
        showTheDetails(d);
      }
      //TODO: should be removed cause they always evaluate false, if evaluate true it results in a console error which is not desirable imho.
      // return empty array when sourceNode or targetNode is undefined to prevent issue #34
      if (_.isUndefined(sourceNode)) {
        $log.error('sourceNode is undefined. link: ' + JSON.stringify(l));
        return [];
      } else if (_.isUndefined(targetNode)) {
        $log.error('targetNode is undefined. link: ' + JSON.stringify(l) + ', sourceNode: ' + JSON.stringify(sourceNode));
        return [];
      } else {
        if (sourceNode.lane === targetNode.lane) {
          var target = {
            "x": targetNode.x +nodeR,
            "y": targetNode.y
          };

          var curve = {
            "x": targetNode.x + 100,
            "y": (targetNode.y + sourceNode.y) / 2
          };
          return [sourceNode, curve, target];
        }else if (sourceNode.lane < targetNode.lane) {
          var target = {
            "x": targetNode.x - (targetNode.lane === 1 ? nodeWidth : nodeR),
            "y": targetNode.y
          };
          return [sourceNode ,target];
        } else {
          var target = {
            "x": targetNode.x + (targetNode.lane === 1 ? 0 : nodeR),
            "y": targetNode.y
          };
          return [sourceNode ,target];
        }
      }
    }


    //function formatLinkNameByIndex(prefix, object) {
    //    return prefix + '-' + object.source + '-' + object.target;
    //}

    //function formatLinkNameByObject(prefix, object) {
    //    return prefix + '-' + object.source.index + '-' + object.target.index;
    //}



    //function findElementByLink(prefix, link) {
    //    var selector = '#' + formatLinkNameByObject(prefix, link);
    //    return graph.select(selector);
    //}

    //function isConnected(a, b) {
    //    //return linkedByIndex[a.index + ',' + b.index]
    //    // || linkedByIndex[b.index + ',' + a.index]
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
    //}










    return {
      restrict: 'E',
      scope: {
        graphData: '='
      },
      controller: 'GraphController',
      link: function (scope, elem) {

        element = elem[0];

        scope.$watch('graphData', function (newVal) {
          if (newVal) {
            data = newVal;
            render(element);
          }
        }, true);
      }
    };
  }

  MsgD3Graph.$inject = ['d3', '$modal', '$window', 'NodeService', 'NodecolorService', '$log'];

    angular.module('msgGraph')
    .directive('msgD3Graph', MsgD3Graph);
}());
