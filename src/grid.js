// http://vasir.net/blog/game_development/dijkstras_algorithm_shortest_path
import * as d3 from "d3";

const colsCount = 20;
const rowsCount = 20;
const size = 50;


let generateGridData = function(columns, rows){
    let cellCount = columns * rows;
    let index = 0;
    let cells = [];

    while( index  < cellCount) {
        let column = index%columns;
        let row = (index - column)/rows;

        cells.push({column, row, walkable: true});
        index++;
    }

    return cells;
}


function createSvg(){
    return d3.select("body")
            .append("svg")
            .attr("class", "world")
            .attr("width", size * colsCount)
            .attr("height", size * rowsCount);
}

let run = function(){
    let data = generateGridData(colsCount, rowsCount);

    let svg = createSvg();
    let columns = svg
        .selectAll('rect')
        .data(data)
        .enter().append('rect')

    columns
        .attr("class", (d, index) => 'world__cell' )
        .attr("width", size)
        .attr("height", size)
        .attr("x", (d,i) => d.column * size)
        .attr("y", (d,i) => d.row * size)

    svg.on("mousedown", function() {
        columns.on('mousemove', function (d, i) {
            d3.select(this).style('fill','red');
            d.walkable = false;
        });
    });   
    
    columns.on('click', function (d, i) {
        console.log(d.walkable);
    });

    svg.on("mouseup", function() {
        columns.on('mousemove', null);
    });

    let redrawCells = function(data){
        console.log('redrawCells')
    }

    let updateAll = function(){
        let updatedCells = svg.selectAll('rect')
            .style('fill', data => data.walkable ? 'white' : 'blue');
    }

    d3.interval(updateAll, 1500);
}

let run2 = function(){

        let svg = d3.select("body")
                    .append("svg")
                    .attr("class", "world")
                    .attr("width", size * colsCount)
                    .attr("height", size * rowsCount);


    for( let colIndex = 0; colIndex < colsCount; colIndex++ ){
        
        let rows = svg.selectAll('rect' + ' .row-' + (colIndex + 1));

        let columns = rows
            .data(d3.range(rowsCount))
            .enter().append('rect')

        columns
            .attr("class", (d, index) => 'world__cell row-' + (colIndex + 1) + ' ' + 'col-' + (index + 1) )
            .attr("width", size)
            .attr("height", size)
            .attr("x", (d,i) => i * size)
            .attr("y", colIndex * size)
        
        columns.on('mouseover', function (d, i) {
            d3.select(this)
                .style('fill', d3.rgb(31, 120, 180));
        });

        columns.on('mouseout', function (d, i) {
            d3.select(this)
                .style('fill','red');
        });
    }
}


export default { run }