function indexToCell(index, columns, rows){
    let column = index%columns;
    let row = (index - column)/rows;

    return {column, row}
}

function cellToIndex(row, colum, rows){
    return row * rows + column;
}


function getNeighbours(index, columns, rows){
    let neighbours = [];
    let cell = indexToCell(index, columns, rows);

    if(cell.column + 1 < columns){
        neighbours.push(index + 1);
    }

    if(cell.column - 1 >= 0){
        neighbours.push(index - 1);
    }

    if(cell.row + 1 < rows){
        neighbours.push(index + rows);
    }

    if(cell.row - 1 >= 0){
        neighbours.push(index - rows);
    }

    return neighbours;
}



function createGrid(columns, rows){
    let count = columns * rows;
    let index = 0;
    let cells = [];

    while( index  < count) {
        let column = index%columns;
        let row = (index - column)/rows;

        cells.push({
            id: `${column}/${row}`,
            index, column, row, walkable: true });
        index++;
    }

    return {cells, columns, rows};
}

function neighboursToLinks(source, items){
    let list = [];

    for(let i = 0; i < items.length; i++){
        list.push({source, target: items[i]});
    }
    
    return list;
}

function cellsToGraph(cells, colums, rows){
    let graph = {nodes:[], links:[]};

    cells.forEach( cell => {
        let neighbours = getNeighbours(cell.index, colums, rows);
        graph.nodes.push(cell);

        graph.links = graph.links.concat(neighboursToLinks(cell.index, neighbours));
    });
    
  
    return graph;
}

function build(columns, rows){
    let grid = createGrid(columns, rows);
    let graph = cellsToGraph(grid.cells, columns, rows);

    return {grid, graph}
}

export default build