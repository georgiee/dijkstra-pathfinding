import * as d3 from "d3";


const rows = 10;
const columns = 10;
const cells = rows * columns;


function toIndex(row, column){
    return row * rows + column;
}


function probeColumn(index, row, column){
    let items = [];
    if(column - 1 >= 0){
        items.push({ source: index, target: toIndex(row, column - 1)});
    }else if(column < columns){
        items.push({ source: index, target: toIndex(row, column)});
    }else if(column +1 < columns){
        items.push({ source: index, target: toIndex(row, column + 1)});
    }

    return items;
}

function isInsideGrid(row, column){
    let index = toIndex(row, column);
    return index >= 0 && index < rows * columns;
}

function getNeighbourLinks(row, column){
    let index;
    let neighbours = [];
    
    if(isInsideGrid(row - 1, column)){
        neighbours.push(toIndex(row - 1, column))
    }
    if(index = isInsideGrid(row + 1, column)){
        neighbours.push(toIndex(row + 1 ,column))
    }
    if(index = isInsideGrid(row, column - 1)){
        neighbours.push(toIndex(row, column - 1)) 
    }
    if(index = isInsideGrid(row, column + 1)){
        neighbours.push(toIndex(row, column + 1))
    }

    return neighbours;
}

function neighboursToLinks(source, items){
    let list = [];
    

    for(let i = 0; i < items.length; i++){
        list.push({source, target: items[i]});
    }
    
    return list;
}

function generateGridGraph(){

    const graph = {
        nodes: [],
        links: []
    }   

    let index = 0;
    while( index  < cells) {
        let column = index%columns;
        let row = (index - column)/rows;
        let neighbours = getNeighbourLinks(row, column);

        graph.nodes.push({
            name: `${row}/${column}`, index 
        });
        graph.links = graph.links.concat(neighboursToLinks(index, neighbours));

        index++;
    }

    return graph;
}

class NodeSimulation {
    constructor(graph){
        this.width = 800;
        this.height = 800;
        this.graph = graph; 
        this.tick = this.tick.bind(this);

        this.init();
        this.updateData();
        this.enableDragging();
    }
    
    
    enableDragging(){
        this.nodeSelector.call(d3.drag()
            .on("start", dragstarted.bind(this))
            .on("drag", dragged.bind(this))
            .on("end", dragended.bind(this))
        );

        function dragstarted(d) {
          if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

    }
    updateData(){
        this.nodeSelector = this.nodeSelector.data(this.graph.nodes);
        this.nodeSelector = this.nodeSelector.enter().append("g").merge(this.nodeSelector);
        this.nodeSelector.append("circle").attr("r", 8);
        this.nodeSelector.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.name });

        this.linkSelector = this.linkSelector.data(this.graph.links);
        this.linkSelector.exit().remove();
        this.linkSelector = this.linkSelector.enter().append("line").merge(this.linkSelector);

        this.simulation.nodes(this.graph.nodes);
        this.simulation.force("link").links(this.graph.links);
        this.simulation.alpha(1).restart();
    }
    
    init(){
        let color = d3.scaleOrdinal(d3.schemeCategory20);

        let svg = d3.select("body")
                        .append("svg")
                        .attr("width", this.width)
                        .attr("height", this.height);


        let simulation = d3.forceSimulation()
                            .force("link", d3.forceLink())
                            .force("charge", d3.forceManyBody().theta(0.5).strength(-90).distanceMax(80))
                            .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        let linkSelector = svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
        
        let nodeSelector = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll(".node")
        
        simulation
            .nodes(this.graph.nodes)
            .on("tick", this.tick);

        simulation.force("link")
            .links(this.graph.links);

        this.simulation = simulation;
        this.linkSelector = linkSelector;
        this.nodeSelector = nodeSelector;
    }
    
    tick(){
        this.linkSelector
            .attr("x1", d => d.source.x )
            .attr("y1", d => d.source.y )
            .attr("x2", d => d.target.x )
            .attr("y2", d => d.target.y );

        //this.nodeSelector
        //    .attr("cx", d => d.x )
        //    .attr("cy", d => d.y );

        this.nodeSelector.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
}

export default {
    run: () => {
        let gridItems = generateGridGraph();
        new NodeSimulation(gridItems);
    }
}
