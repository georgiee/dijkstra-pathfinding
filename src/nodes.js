//http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
import * as d3 from "d3";
import {minBy} from "lodash";

import gridData from './grid-data';
import GraphDrawer from './graph-drawer';
import GridDrawer from './grid-drawer';
import DijkstraRunner from './dijkstra-runner';

function run(){
    let data = gridData(10, 10);
    
    let graphDrawer = new GraphDrawer(data.graph, 50);
    //let gridDrawer = new GridDrawer(data.grid, 20);

    let dijkstra = new DijkstraRunner(data.graph)
    dijkstra.start();
    
    dijkstra.events.on('update', wakeup);
    

    
    //gridDrawer.events.on('update', wakeup);

    window.addEventListener('keyup', event => {
        if(event.keyCode == 83) { //key s
            dijkstra.run();
        }
        if(event.keyCode == 88) {//key x
            graphDrawer.wakeup();
        }
    })

    function wakeup(){
        graphDrawer.wakeup();
    }

}

export default { run }
