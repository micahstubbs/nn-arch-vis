// scripts online
// '//d3js.org/d3.v3.min.js'
// 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.10.3/babel.min.js'
var width = 960,
    height = 500,
    radius = 20;

const drawNodeIDs = undefined;

const margin = { top: 0, left: 40, bottom: 0, right: 40 };

var fill = d3.scale.category20();

var force = d3.layout.force()
  .gravity(0.05)
  .charge(-50) // -50
  .linkDistance(50)
  .size([width, height])
  .linkStrength(0.005)
  .friction(0.9)
  .theta(0.8)
  .alpha(0.1)

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .style({
    fill: 'none',
    stroke: 'black',
    'stroke-width': 1
  });

d3.json('graph.json', function(error, graph) {
  if (error) throw error;

  graph.nodes.forEach((node, i) => {
    if (typeof node.id === 'undefined') node.id = i;
  })
  
  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden');

  // no self-links
  const noSelfLinks = graph.links.filter(d => d.source !== d.target);
  
  // only self-links
  const onlySelfLinks = graph.links.filter(d => d.source === d.target);

  const link = svg.selectAll('line')
    .data(noSelfLinks)
    .enter().append('line');

  const selfLink = svg.selectAll('path')
    .data(onlySelfLinks)
    .enter().append('path');

  var node = svg.selectAll('g')
    .data(graph.nodes)
    .enter().append('g')
      .classed('node', true)
      .call(force.drag);;

  node
    .append('circle')
    .attr('r', radius - 0.75)
    .style('fill', function(d) { 
      console.log('d from the fill function', d);
      return cellStyles[d.name].color; 
    })
    .style('stroke', 'none')

  // draw shapes if specified
  node
    .each(function (d) {
      if (typeof cellStyles[d.name].shape !== 'undefined') {
        switch(cellStyles[d.name].shape) {
          case 'circle':
            d3.select(this)
              .append('circle')
              .attr('r', radius - 8)
              .style('fill', 'none')
              .style('stroke', '#999')
              .style('stroke-width', '3px');
            break;
          case 'triangle':
            const triangle = d3.svg.symbol().type('triangle-up')
              .size(function(d){ return radius * 12; });
            d3.select(this)
              .append('path')
              .style('fill', 'none')
              .style('stroke', '#999')
              .style('stroke-width', '3px')
              .attr('d', triangle)
              .attr('transform', `translate(0,${-2})`)
          default:
        }
      }
    })

  // draw nodeIDs 
  node
    .append('text')
    .classed('nodeText', true)
    .style('stroke', 'black')
    .style('fill', 'black')
    .style('opacity', () => {
      if (typeof drawNodeIDs === 'undefined') { return 0; }
      return 1;
    })
    .attr('dx', d => {
      if (d.id < 10) return '-0.265em';
      return '-0.45em'
    })
    .attr('dy', '0.35em')
    .text(d => d.id);


  force
    .nodes(graph.nodes)
    .links(graph.links)
    .on('tick', tick)
    .start();

  const maxDepth = d3.max(graph.nodes.map(d => d.depth));
  const chartInnerWidth = width - margin.left - margin.right;
  const maxNodeInnerWidth = chartInnerWidth / maxDepth;
  const nodeInnerWidth = d3.min([radius * 3, maxNodeInnerWidth]);
  const chartMiddle = margin.left + (chartInnerWidth / 2);
  const networkWidth = (nodeInnerWidth * maxDepth) + radius;
  console.log('maxDepth', maxDepth);
  console.log('chartInnerWidth', chartInnerWidth);
  console.log('maxNodeInnerWidth', maxNodeInnerWidth);
  console.log('nodeInnerWidth', nodeInnerWidth);
  console.log('chartMiddle', chartMiddle);
  console.log('networkWidth', networkWidth);

  function selfLinkCurve (cx, cy, r) {
    const controlPointXFactor = 0.005;
    const yOffset = r / 10;
    const start = {};
    start.x = cx + (r * Math.cos(0.685 * 2 * Math.PI));
    start.y = cy + (r * Math.sin(0.685 * 2 * Math.PI)) + yOffset;
    const end = {};
    end.x = cx + (r * Math.cos(0.825 * 2 * Math.PI));
    end.y = cy + (r * Math.sin(0.825 * 2 * Math.PI)) + yOffset;
    const c1 = {};
    c1.x = start.x * (1 - controlPointXFactor)
    c1.y = start.y - (r * 0.9);
    const c2 = {};
    c2.x = end.x * (1 + controlPointXFactor);
    c2.y = end.y - (r * 0.9);
    return `M${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  }

  function tick() {
    node.each(function(d) {
      d.x = (nodeInnerWidth * d.depth) + chartMiddle - (networkWidth / 2);
    })

    // node.attr('x', function(d) {return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    //    .attr('y', function(d) {return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

    node.attr('transform', d => {
      return `translate(
        ${Math.max(radius, Math.min(width - radius, d.x))},
        ${Math.max(radius, Math.min(height - radius, d.y))}
      )`
    })      

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    link
      .style('stroke', '#999')
      .style('stroke-width', '3px');

    selfLink
      .attr('d', d => selfLinkCurve(d.source.x, d.source.y, radius));

    selfLink
      .style('stroke', '#999')
      .style('stroke-width', '3px')
      .style('fill', 'none');
  }
  
  node
    .on('mouseover', function(d){
      return tooltip
        .text(d.name)
        .style('visibility', 'visible');
    })
    .on('mousemove', function(){
      return tooltip
        .style('top', (event.pageY - 10) + 'px')
        .style('left',(event.pageX + 10) + 'px');
    })
    .on('mouseout', function(){
      return tooltip
        .style('visibility', 'hidden')
    });

  let nodeTextVisible = drawNodeIDs;

  svg
    .on("dblclick", () => {
      let newOpacity;
      // set the new opacity 
      // then
      // Update whether or not the node text is visible
      if (typeof nodeTextVisible === 'undefined') {
        newOpacity = 1;
        nodeTextVisible = true;
      } else {
        newOpacity = 0;
        nodeTextVisible = undefined;
      }
      // Hide or show the node text
      d3.selectAll('.nodeText')
          .transition().duration(100) 
          .style("opacity", newOpacity);
  });
});