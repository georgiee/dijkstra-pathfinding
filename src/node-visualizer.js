//Hexagonal Grids - Red Blob Games
//www.redblobgames.com/grids/hexagons/

import * as d3 from "d3";

class NodeSimulator {
    constructor(graph){
        this.width = 800;
        this.height = 800;

        this.graph = graph; 
        this.tick = this.tick.bind(this);

        this.buildSvg();
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
    buildSvg(){
        let svg = d3.select("body")
                    .append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);
        this.svg = svg;
    }
    
    createSimulation(){
        let simulation = d3.forceSimulation()
                    .force("link", d3.forceLink())
                    .force("charge", d3.forceManyBody().theta(0.5).strength(-90).distanceMax(80))
                    .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        this.simulation = simulation;
    }
    
    init(){
        this.createSimulation();
        console.log('this.graph.nodes', this.graph.nodes)
        this.simulation
            .nodes(this.graph.nodes)
            .on("tick", this.tick);

        this.simulation
            .force("link")
            .links(this.graph.links);

        this.linkSelector = this.svg.append("g")
                    .attr("class", "links")
                    .selectAll("line");
        
        this.nodeSelector = this.svg.append("g")
                    .attr("class", "nodes")
                    .selectAll(".node");
    }
    
    tick(){

        this.linkSelector
            .attr("x1", d => d.source.x )
            .attr("y1", d => d.source.y )
            .attr("x2", d => d.target.x )
            .attr("y2", d => d.target.y );

        this.nodeSelector
            .attr("transform", d =>  "translate(" + d.x + "," + d.y + ")");
    }
}

export { NodeSimulator }