//http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
import * as d3 from "d3";
import {minBy} from "lodash";

import gridData from './grid-data';
import GraphDrawer from './graph-drawer';
import GridDrawer from './grid-drawer';
import DijkstraRunner from './dijkstra-runner';

function run(){
    let data = gridData(30, 30);
    
    //let graphDrawer = new GraphDrawer(data.graph, 20);
    let gridDrawer = new GridDrawer(data.grid, 20);

    let dijkstra = new DijkstraRunner(data.graph)
    dijkstra.start();
    
    dijkstra.events.on('update', wakeup);
    
    function findPath ( endNode){
        let path = [];
        let current = endNode
        let x = 0;

        path.push(current);

        while(current){
            let nearestPrevEdge = minBy(current.links, prev => prev.target.distance);
            current = nearestPrevEdge.target
            path.push(current);
            
            if(current.distance == 0){
                current = null
            }

        }

        return path;
    }

    dijkstra.events.on('completed', function(){
        let path = findPath(data.graph.nodes[data.graph.nodes.length - 1]);
        gridDrawer.showPath(path);
    });
    
    gridDrawer.events.on('update', wakeup);

    window.addEventListener('keyup', event => {
        if(event.keyCode == 83) { //key s
            dijkstra.run();
        }
        if(event.keyCode == 88) {//key x
            dijkstra.step();
            //graphDrawer.wakeup();
        }
    })

    function wakeup(){
        gridDrawer.tick();
        //graphDrawer.wakeup();
    }

}

export default { run }
