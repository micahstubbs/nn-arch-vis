const fs = require('fs');
const jsonfile = require('jsonfile');

const networkType = 'deep-convolutional-network';
const connectedness = 'fullyConnected';
const inputFile = `${networkType}/layers.json`;
const layers = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const graph = {
  nodes: [],
  links: []
};

// generate node list
layers.forEach(layer => {
  for (let j = 0; j < layer.nodeCount; j++) {
    graph.nodes.push({
      name: layer.nodeType,
      depth: layer.depth
    })
  }
})

// generate link list
if (connectedness === 'fullyConnected') {
  const iterations = layers.length - 1;
  console.log('iterations', iterations);
  for (let i = 0; i < iterations; i++) {
    generateLinks(layers[i], layers[i + 1]);
  }
}

function generateLinks(sourceLayer, targetLayer) {
  console.log('generateLinks was called');
  console.log('sourceLayer', sourceLayer);
  console.log('targetLayer', targetLayer);
  const shallowerLayers = layers.filter(d => {
    return d.depth < sourceLayer.depth;
  });
  console.log('shallowerLayers', shallowerLayers);
  let firstNodeInLayerID;
  if (shallowerLayers.length === 1) {
    firstNodeInLayerID = shallowerLayers[0].nodeCount;
  } else {
    firstNodeInLayerID = shallowerLayers
      .map(d => d.nodeCount)
      .reduce((a, b) => a + b, 0);
  }
  console.log('firstNodeInLayerID', firstNodeInLayerID);

  for (let i = 0; i < sourceLayer.nodeCount; i++) {
    const sourceNodeID = firstNodeInLayerID + i;
    for(let j = 0; j < targetLayer.nodeCount; j++) {
      const targetNodeID = firstNodeInLayerID + sourceLayer.nodeCount + j;
      graph.links.push({
        source: sourceNodeID,
        target: targetNodeID,
        value: 1
      })
    }
  }
}

const outputData = graph;
const outputFile = `${networkType}/graph.json`;
jsonfile.spaces = 2;

jsonfile.writeFile(outputFile, outputData, function (error) {
  console.error(error)
})
