
class GridData {
    constructor(columns, rows){
        this.columns = columns;
        this.rows = rows;
    }

    toIndex(row, column){
        return row * this.rows + column;
    }
    
    fromIndex(index){
        let column = index%this.columns;
        let row = (index - column)/this.rows;

        return {column, row}
    }
    
    contains(row, column){
        let index = toIndex(row, column);
        return index >= 0 && index < this.rows * this.columns;
    }

    getCellCount(){
        return this.columns * this.rows;
    }

    generateList(){
        let cellCount = this.getCellCount();

        let index = 0;
        let cells = [];

        while( index  < cellCount) {
            let column = index%this.columns;
            let row = (index - column)/this.rows;

            cells.push({column, row, walkable: true});
            index++;
        }

        return cells;
    }
    
    getNeighbours(index){
        let neighbours = [];
        let cell = this.fromIndex(index);
        
        if(cell.column + 1 < this.columns){
            neighbours.push(index + 1);
        }

        if(cell.column - 1 >= 0){
            neighbours.push(index - 1);
        }


        if(cell.row + 1 < this.rows){
            neighbours.push(index + this.rows);
        }

        if(cell.row - 1 >= 0){
            neighbours.push(index - this.rows);
        }

        return neighbours;
    }
    
    toArray(){
        let cellCount = this.getCellCount();
        let cells = [];
        let index = 0;

        while( index  < cellCount) {
            let cell = this.fromIndex(index);
            cells.push({ row: cell.row, column: cell.column, walkable: true });
            
            index++;
        }

        return cells;
    }

    toGraph(){
        let graph = {nodes:[], links:[]};

        let index = 0;
        let cellCount = this.getCellCount();

        while( index  < cellCount) {
            let neighbours = this.getNeighbours(index);
            let cell = this.fromIndex(index);
            console.log('neighbours, ', neighbours);
            graph.nodes.push({
                name: `${cell.row}/${cell.column}`, index 
            });
            graph.links = graph.links.concat(neighboursToLinks(index, neighbours));

            index++;
        }

        console.log('graph.link', graph.links)

        return graph;
    }

}



function neighboursToLinks(source, items){
    let list = [];
    

    for(let i = 0; i < items.length; i++){
        list.push({source, target: items[i]});
    }
    
    return list;
}


let gridData = new GridData(20, 20);

console.log(gridData.toGraph());

function generateGridData(columns, rows){
    let grid = new GridData(columns, rows);
    return grid.toArray();
}

function generateGraphData(columns, rows){
    let grid = new GridData(columns, rows);
    return grid.toGraph();
}

export { generateGridData, generateGraphData }