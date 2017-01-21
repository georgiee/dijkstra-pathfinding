//http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
import GraphDrawer from './graph-drawer';
import Graph from "graph-data-structure";
import * as d3 from "d3";

import GridData from './grid-data';

let graph = Graph();
graph.addNode("a");
graph.addNode("b");
graph.addNode("c");
graph.addNode("d");
graph.addNode("e");
graph.addNode("f");
graph.addNode("g");
graph.addNode("h");
graph.addNode("i");


graph.addEdge("a", "f");

graph.addEdge("a", "g");

graph.addEdge("a", "h");

graph.addEdge("a", "i");

graph.addEdge("a", "b");
graph.addEdge("b", "c");
graph.addEdge("c", "d");
graph.addEdge("d", "e");

let serializedGraph = graph.serialize();

function process(){
    console.log('process', serializedGraph);
    let unvisited = [];

    let startNode = serializedGraph.nodes[0];
    let {links, nodes} = serializedGraph;
    
    nodes.forEach(node => {
        node.links = [];

        if (node != startNode) {
            node.distance = Infinity;
            unvisited.push(node);
            node.visited = false;
        }
    })

    links.forEach(link => {
        link.cost = 1;
        console.log('link', link);
        link.source.links.push(link);
    })

    let current = startNode;
        current.distance = 0;

    function tick(){
        current.visited = true;
        console.log('current', current)
        current.links.forEach(function(link) {
            let target = link.target;
            if (!target.visited) {
                var distance = current.distance + link.cost;
                target.distance = Math.min(distance, target.distance);
            }
        });

        if (unvisited.length == 0 || current.distance == Infinity) {
            console.log('***end')
            return true;
        }

        unvisited.sort(function(a, b) {
            return b.distance - a.distance 
        });
        current = unvisited.pop()
        console.log('current', current)
    }

    tick();
    tick();
    tick();
    tick();
    tick();
    tick();
    tick();
    tick();
    tick();
    console.log(links)
}

function run(){
    console.log('run dijkstra')
    let graphDrawer = new GraphDrawer(serializedGraph);
    process();
}

export default { run }