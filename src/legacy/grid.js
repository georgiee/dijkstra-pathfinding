// http://vasir.net/blog/game_development/dijkstras_algorithm_shortest_path
import * as d3 from "d3";

class Grid {
    constructor(data, columns, rows, size = 50){
        this.colsCount = columns;
        this.rowsCount = rows;
        this.size = size;

        this.data = data;
        
        this.createSvg();

        this.build();
        this.enableMouse();
    }
    
    createSvg(){
        this.svg = d3.select("body")
            .append("svg")
            .attr("class", "world")
            .attr("width", this.size * this.colsCount)
            .attr("height", this.size * this.rowsCount);
    }
    
    build(){
        let columns = this.svg
            .selectAll('rect')
            .data(this.data)
            .enter().append('rect')

        columns
            .attr("class", (d, index) => 'world__cell' )
            .attr("width", this.size)
            .attr("height", this.size)
            .attr("x", (d, i) => d.column * this.size)
            .attr("y", (d, i) => d.row * this.size)
        
        this.columnsSelector = columns;
    }
    
    enableMouse(){
        this.svg.on("mousedown", () => {
            this.columnsSelector.on('mousemove',  function(d, i){
                d3.select(this).style('fill','red');
                d.walkable = false;
            });
        });

        this.svg.on("mouseup", () => this.columnsSelector.on('mousemove', null));
    }

    update(){
       this.svg.selectAll('rect')
            .style('fill', data => data.walkable ? 'white' : 'blue');
    }
    
}

let run = function(){
    let data = generateGridData(colsCount, rowsCount);
    let grid = new Grid(data);

    d3.interval(function(){
        grid.update();
    }, 1500);
}

export { run, Grid }