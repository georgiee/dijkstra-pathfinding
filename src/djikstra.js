import * as d3 from "d3";
import { Grid } from './grid';
import { generateGridData, generateGraphData} from './utils';
import { NodeSimulator } from './node-visualizer';

const rows = 10;
const columns = 10;

const run = function(){
    let data = generateGridData(columns, rows);
    let nodeData = generateGraphData(columns, rows);
    
    let grid = new Grid(data, columns, rows);

    d3.interval(function(){
        grid.update();
    }, 1500);

    let nodes = new NodeSimulator(nodeData);
}

export default { run }