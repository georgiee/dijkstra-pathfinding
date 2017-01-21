import * as d3 from "d3";
import { Grid } from './grid';
import { generateGridData, generateGraphData} from './utils';
import { NodeSimulator } from './node-visualizer';

import Graph from "graph-data-structure";

const rows = 10;
const columns = 10;

let graph = Graph();
graph.addNode("a");
graph.addNode("b");
graph.addNode("c");

graph.addEdge("a", "b");
graph.addEdge("b", "c");


console.log('serialize', graph.serialize());

const run = function(){
    let data = generateGridData(columns, rows);
    let nodeData = graph.serialize()
    
    let grid = new Grid(data, columns, rows);

    d3.interval(function(){
        grid.update();
    }, 1500);

    let nodes = new NodeSimulator(nodeData);
}

export default { run }