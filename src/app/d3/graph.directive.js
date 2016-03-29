'use strict';

// graph module
angular.module('msgGraph')
    .directive('msgD3Graph', MsgD3Graph);

MsgD3Graph.$inject = ['d3', 'NodeService', '$modal', 'NodecolorService'];
function MsgD3Graph(d3, NodeService, $modal, NodecolorService) {

    var margin = {top: 20, right: 0, bottom: 20, left: 0},
        width = window.innerWidth - margin.right - margin.left - 16,
        height = window.innerHeight,
        minheight = window.innerHeight,
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
        nodeR = 16;

    function getGraphHeight(data) {
        var numberOfNodesOnBiggestLane = _.max(_.values(_.groupBy(data.nodes, function (n) {
                return n.lane;
            })), function (nodes) {
                return nodes.length;
            }).length + 1;

        if (numberOfNodesOnBiggestLane) {
            if (numberOfNodesOnBiggestLane * 75 > minheight) {
                return numberOfNodesOnBiggestLane * 75
            } else {
                return minheight
            }
        } else {
            return 0
        }
    }

    function render(element) {

        height = getGraphHeight(data);

        //NODE_TYPES = getNodeTypes(data.nodes);

        d3.select("svg").remove();
        graph = d3.select(element).append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height)
            .append("g");
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        layout = d3.layout.force()
            .size([width, height]);

        d3.select(window).on("resize", resize); //Adds or removes an event listener to each element in the current selection, for the specified type.
        determineFontSize();
        renderGraph(data);
    }

    function renderGraph(data) {
        var laneLength = data.lanes.length;
        var verticalNodeSpace = 70;

        var uiCounter = 0;
        var epCounter = 0;
        var microCounter = 0;
        var dbCounter = 0;

        // Scales
        var x = d3.scale.linear()
            .domain([margin.right, margin.right + width])
            .range([0, width]);

        var x1 = d3.scale.linear()
            .domain([0, laneLength])
            .range([margin.left, width]);

        var y1 = d3.scale.linear()
            .range([0, height]);

        //Update data
        for (var i = 0; i < data.nodes.length; i++) {
            var node = data.nodes[i];
            node.index = i;
            node.x = x1(node.lane + 0.5);
            switch (node.lane) {
                case 0:
                    uiCounter++;
                    node.y = verticalNodeSpace * uiCounter + 50;
                    break;
                case 1:
                    epCounter++;
                    node.y = verticalNodeSpace * epCounter + 50;
                    break;
                case 2:
                    microCounter++;
                    node.y = verticalNodeSpace * microCounter + 50;
                    break;
                case 3:
                    dbCounter++;
                    node.y = verticalNodeSpace * dbCounter + 50;
                    break;
            }

            //        data.links.forEach(function (d) {
            //          if (d.source === node.index) {
            //            d.source = node;
            //          }
            //          if (d.target === node.index) {
            //            d.target = node;
            //          }
            //        });
        }

        //Labels
        graph.append("svg:g")
            .selectAll(".label")
            .data(data.lanes)
            .enter()
            .append("svg:text")
            .text(function (d) {
                return d.type;
            })
            .attr("x", function (d, i) {
                return x1(i + 0.5);
            })
            .attr("y", 70)
            .attr("text-anchor", "middle")
            .attr("class", "lane-title")
            .style("font-size", titleFontSize);

        ////legend
        //graph.append("svg:g")
        //    .selectAll("type")
        //    .data(GraphService.getTypes())
        //    .enter()
        //    .append("svg:text")
        //    .text(function (d) {
        //        return d.key;
        //    })
        //    .attr("x", 0)
        //    .attr("y", function (d, i) {
        //        return 20*i;
        //    })
        //    .attr("text-anchor", "left")
        //    .style("font-size", textFontSize)
        //    .style("fill", function (d) {
        //        return NodecolorService.getColorFor(d.key)
        //    });

        // Markers
        arrowheads = graph.append("svg:defs")
            .append("svg:marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", nodeR + 9)
            .attr("refY", 0.0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("class", "link")
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        var lineFunction = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            .interpolate("basis");

        links = graph.append('svg:g')
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("path")
            .on("click", onLinkMouseDown)
            .attr("class", "link")
            .attr("d", function (l) {
                var sourceNode = data.nodes.filter(function (d, i) {
                    return i === l.source.index;
                })[0];
                var targetNode = data.nodes.filter(function (d, i) {
                    return i === l.target.index;
                })[0];
                if (sourceNode.lane === targetNode.lane) {
                    var curve = {
                        "x":targetNode.x + 100,
                        "y":(targetNode.y + sourceNode.y) / 2
                    };
                    return lineFunction([sourceNode,curve,targetNode]);
                }
                return lineFunction([sourceNode,targetNode]);
            })
            .attr("stroke", "black")
            .attr("pointer-events", "none")
            .attr("marker-end", "url(#arrow)");

        clickableLinks = graph.append('svg:g')
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("path")
            .on("click", onLinkMouseDown)
            .attr("class", "clickablelink")
            .attr("d", function (l) {
                var sourceNode = data.nodes.filter(function (d, i) {
                    return i === l.source.index;
                })[0];
                var targetNode = data.nodes.filter(function (d, i) {
                    return i === l.target.index;
                })[0];
                if (sourceNode.lane === targetNode.lane) {
                    var curve = {
                        "x":targetNode.x + 100,
                        "y":(targetNode.y + sourceNode.y) / 2
                    };
                    return lineFunction([sourceNode,curve,targetNode]);
                }
                return lineFunction([sourceNode,targetNode]);
            })
            //.attr("x1", function (l) {
            //    var sourceNode = data.nodes.filter(function (d, i) {
            //        return i === l.source.index;
            //    })[0];
            //    d3.select(this).attr("y1", sourceNode.y);
            //    return sourceNode.x;
            //})
            //.attr("x2", function (l) {
            //    var targetNode = data.nodes.filter(function (d, i) {
            //        return i === l.target.index;
            //    })[0];
            //    d3.select(this).attr("y2", targetNode.y);
            //    return targetNode.x;
            //})
            .attr("visibility", "hidden")
            .attr("stroke-width", 10)
            .attr("pointer-events", "stroke")
            .on("mouseover", function (d) {
                tooltip.text(d.source.id + " - " + d.target.id);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function () {
                var coordinates = d3.mouse(this);
                var x = coordinates[0];
                var y = coordinates[1];
                return tooltip.attr("x", (x + 15) + "px").attr("y", (y + 20) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            });

        // Nodes
        nodes = graph.append('svg:g')
            .selectAll("node")
            .data(data.nodes)
            .enter()
            .append("svg:g")
            .attr("class", "node")
            .call(layout.drag)
            .on("mousedown", onNodeMouseDown);

        // Circles
        nodes.attr("id", function (d) {
            return formatClassName('node', d);
        });
        nodes.append("svg:circle")
            .attr("class", function (d) {
                return formatClassName('circle', d);
            })
            .attr("r", nodeR)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .on("mouseover", _.bind(onNodeMouseOver, this, nodes, links))
            .on("mouseout", _.bind(onNodeMouseOut, this, nodes, links))
            .style("stroke", function (o) {
                return fillColor(o);
            })
            .style("stroke-width", 5)
            .style("fill", '#ffffff');


        // A copy of the text with a thick white stroke for legibility.
        nodes.append("svg:text")
            .attr("x", function (d) {
                return x1(d.lane + 0.5);
            })
            .attr("y", function (d) {
                return d.y + 25;
            })
            .attr("class", function (d) {
                return 'shadow ' + formatClassName('text', d);
            }).text(function (d) {
                var name = d.id;
                if (d.details.virtual === true)
                    name = d.id + ' (virtual)';
                return name;
            })
            .attr("text-anchor", "middle")
            .style("font-size", textFontSize);

        nodes.append("svg:text")
            .attr("class", function (d) {
                return formatClassName('text', d);
            })
            .attr("x", function (d) {
                return x1(d.lane + 0.5);
            })
            .attr("y", function (d) {
                return d.y + 25;
            })
            .text(function (d) {
                var name = d.id;
                if (d.details.virtual === true)
                    name = d.id + ' (virtual)';
                return name;
            })
            .attr("text-anchor", "middle")
            .style("font-size", textFontSize);


        //Lanes
        graph.append("svg:g")
            .selectAll(".lane")
            .data(data.lanes)
            .enter()
            .append("svg:line")
            .attr("class", "lane")
            .attr("x1", function (d) {
                return x1(d.lane);
            })
            .attr("x2", function (d) {
                return x1(d.lane);
            })
            .attr("y1", 0)
            .attr("y2", height)
            .style("visibility", function (d, i) {
                return i === 0 ? "hidden" : "visible";
            });

        // tooltip
        var tooltip = graph
            .append("svg:text")
            .style("visibility", "hidden")
            .style("fill", "#5AADBB");

        // Build linked index
        data.links
            .forEach(function (d) {
                linkedByIndex[d.source.index + "," + d.target.index] = 1;
            });
    }

    function resize() {
        width = window.innerWidth - margin.right - margin.left;
        height = window.innerHeight;

        graph.attr("width", width).attr("height", height);


        d3.select("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height);

        render(element);
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

    // Helpers
    function formatClassName(prefix, object) {
        return prefix + '-' + object.id.replace(/(\.|\/|:)/gi, '-');
    }

    function formatLinkNameByIndex(prefix, object) {
        return prefix + '-' + object.source + '-' + object.target;
    }

    function formatLinkNameByObject(prefix, object) {
        return prefix + '-' + object.source.index + '-' + object.target.index;
    }

    function findElementByNode(prefix, node) {
        var selector = '.' + formatClassName(prefix, node);
        return graph.select(selector);
    }

    function findElementByLink(prefix, link) {
        var selector = '#' + formatLinkNameByObject(prefix, link);
        return graph.select(selector);
    }

    function isConnected(a, b) {
        //return linkedByIndex[a.index + "," + b.index]
        // || linkedByIndex[b.index + "," + a.index]
        // || a.index === b.index;
        if (a.index === b.index) {
            return true;
        }
        var connected = false;
        data.links.forEach(function (d) {
            if ((d.source === a && d.target === b) || (d.source === b && d.target === a)) {
                connected = true;
            }
        });
        return connected;
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
        nodes.style("stroke-opacity", function (node) {
            if (connectedNodes.indexOf(node) > -1) {
                return 1;
            } else {
                return opacity;
            }
        });

        links.style("opacity", function (link) {
            if(link.source.id === connectedNodes[0].id && connectedNodes.indexOf(link.target)){
                return 1
            } else if(link.target.id === connectedNodes[0].id && connectedNodes.indexOf(link.source)) {
                return 1
            } else {
                return opacity;
            }
        });
    }

    function fillColor(o) {

        if (o.details !== undefined) {
            return NodecolorService.getColorFor(o.details.type);
        }

    }

    function showTheDetails(node) {
        NodeService.setNode(node);
        var modalInstance = $modal.open({
            templateUrl: 'app/nodemodal/nodemodal.html',
            controller: 'NodeModalController'
        });

        modalInstance.result.then(function (node) {
            NodeService.pushNode(node);
        }, function () {
            render(element);
        });
    }

    /*
     Mouse events
     */

    function onNodeMouseOver(nodes, links, d) {

        // Highlight circle
        var elm = findElementByNode('circle', d);
        elm.style("fill", fillColor(d));

        // Highlight related nodes
        //fadeRelatedNodes(d, 0.05, nodes, links);
        fadeUnrelatedNodes(d, 0.2, nodes, links);
    }

    function onNodeMouseOut(nodes, links, d) {

        // Highlight circle
        var elm = findElementByNode('circle', d);
        elm.style("fill", '#ffffff');
        //elm.style("stroke", "steelblue");

        // Highlight related nodes
        //fadeRelatedNodes(d, 1, nodes, links);
        fadeUnrelatedNodes(d, 1, nodes, links);
    }

    function onLinkMouseDown(d) {

    }

    function onNodeMouseDown(d) {
        d.fixed = true;
        d3.select(this).classed("sticky", true);
        showTheDetails(d);
    }


    return {
        restrict: 'E',
        scope: {
            graphData: '='
        },
        controller: 'GraphController',
        link: function (scope, elem, attrs) {

            element = elem[0];

            //scope.$on('nodesFiltered', function (event, value) {
            //    console.log(value);
            //    data = value;
            //    render(element);
            //});

            scope.$watch('graphData', function (newVal, oldVal) {
                if (newVal) {
                    data = newVal;
                    render(element);
                }
            }, true);
        }
    }
}
;
