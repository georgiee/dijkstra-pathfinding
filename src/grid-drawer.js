import * as d3 from "d3";
import * as chromatics from 'd3-scale-chromatic';

const colorScale = d3.scaleLinear()
    .interpolate(function() {
      return t => chromatics.interpolateSpectral(t)
    })
    .domain([0, 25])



function getNodeColor(d){

    if(d.visited){
        return colorScale(d.distance)
    }
    return false;
}

class GridDrawer {
    constructor(data, cellSize = 50){
        this.events = d3.dispatch("update");

        this.colsCount = data.columns;
        this.rowsCount = data.rows;
        this.cellSize = cellSize;
        
        this.cells = data.cells;
        this.data = data;

        this.build();
    }
    
    build(){
        this.createSvg();
        this.addCells();
        this.enableMouse();
    }
    
    showPath(cells){
        console.log('showPath', cells)
        let columns = this.svg
            .selectAll('.world__cell')
            .data(cells, d => d.id)
            .classed("is-path", true)

        this.tick();
    }
    
    addCells(){
        let columns = this.svg
            .selectAll('.world__cell')
            .data(this.cells)
            .enter().append("g")
            .attr("class", (d, index) => 'world__cell' )
            .attr("transform", (d, i) => {
                let x = d.column * this.cellSize
                let y = d.row * this.cellSize
                
                return "translate("+ x + ","+ y +")";
            })

        let rect = columns.append("rect")
            .attr("width", this.cellSize)
            .attr("height", this.cellSize)

        /*let label = columns.append("text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("dx", this.cellSize/2)
            .attr("dy", this.cellSize/2)
            .text( d =>  `${d.column}-${d.row}`)
        */
        this.columnsSelector = columns;
    }
    
    tick(){
        this.columnsSelector
            .classed("is-tentative", d => d.tentative)
            .classed("is-obstacle", d => d.obstacle)
            .select("rect")
            .style("fill", getNodeColor)
    }
    
    enableMouse(){
        let self = this;

        this.columnsSelector.on('mousedown',  function(d, i){
            d.obstacle = !d.obstacle;
            self.events.call('update');
        });

        this.svg.on("mousedown", () => {
            this.columnsSelector.on('mouseenter',  function(d, i){
                d3.select(this).style('fill','red');
                d.obstacle = !d.obstacle;

                self.events.call('update');
            });
        });

        this.svg.on("mouseup", () => this.columnsSelector.on('mouseenter', null));
    }


    createSvg(){
        this.svg = d3.select("body")
            .append("svg")
            .attr("class", "world")
            .attr("width", this.cellSize * this.colsCount)
            .attr("height", this.cellSize * this.rowsCount);
    }
}


export default GridDrawer;