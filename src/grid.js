//http://bl.ocks.org/sdjacobs/3900867adc06c7680d48
import * as d3 from "d3";

import gridData from './grid-data';
import GraphDrawer from './graph-drawer';
import GridDrawer from './grid-drawer';
import DijkstraRunner from './dijkstra-runner';

function run(){
    let data = gridData(20, 20);
    
    //let graphDrawer = new GraphDrawer(data.graph, 5);
    let gridDrawer = new GridDrawer(data.grid, 20);

    let dijkstra = new DijkstraRunner(data.graph)
    dijkstra.start();
    
    dijkstra.events.on('update', wakeup);
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
    //dijkstra(data.graph, graphDrawer)

}

export default { run }
