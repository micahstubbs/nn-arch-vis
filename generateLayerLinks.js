var fs = require('fs');
var jsonfile = require('jsonfile');

const firstNodeInLayerID = 6;
const sourceLayerNodeCount = 3;
const targetLayerNodeCount = 3;
const connectedness = 'fullyConnected';

const links = [];

if (connectedness === 'fullyConnected') {
  for (let i = 0; i < sourceLayerNodeCount; i++) {
    const sourceNodeID = firstNodeInLayerID + i;
    for(let j = 0; j < targetLayerNodeCount; j++) {
      const targetNodeID = firstNodeInLayerID + targetLayerNodeCount + j;
      links.push({
        source: sourceNodeID,
        target: targetNodeID,
        value: 1
      })
    }
  }
}

const outputData = links;
const outputFile = `${sourceLayerNodeCount}-${targetLayerNodeCount}-f${firstNodeInLayerID}-${connectedness}-links.json`;
jsonfile.spaces = 2;

jsonfile.writeFile(outputFile, outputData, function (error) {
  console.error(error)
})