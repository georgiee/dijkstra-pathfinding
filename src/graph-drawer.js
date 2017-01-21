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


class GraphDrawer {
    constructor(graph, distance = 50){
        console.log('graph', graph)
        this.distance = distance;
        this.width = 500;
        this.height = 500;

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
        this.nodeSelector = this.nodeSelector.enter()
            .append("g")
            .attr("class", "node")
            .merge(this.nodeSelector);
        
        this.nodeSelector 
            .attr("transform", (d, i) => {
                console.log(d)
                let x = d.column * 10
                let y = d.row * 10
            
                x += this.width / 2;
                y += this.height / 2;
                d.x = x;
                d.y = y;
                return "translate("+ x + ","+ y +")";
            })
        
        this.nodeSelector.append("circle").attr("r", 2);
        /*this.nodeSelector.append("text")
            .attr("dx", 12)
            .attr("class", "text-label")
            .attr("dy", ".35em")
            .text(function(d) { return d.id });
        */
        /*
            this.nodeSelector.append("text")
            .attr("dx", 0)
            .attr("class", "text-distance")
            .attr("dy", "-.5em")
            .text(function(d) { return d.distance + '' });
            */

        this.linkSelector = this.linkSelector.data(this.graph.links);
        this.linkSelector.exit().remove();
        this.linkSelector = this.linkSelector.enter().append("line").merge(this.linkSelector);

        this.simulation.nodes(this.graph.nodes);
        this.simulation.force("link").links(this.graph.links);
        this.simulation.alpha(1).restart();

        this.nodeSelector.on("click", function(d) {
            d.obstacle = !d.obstacle;
        });

        this.nodeSelector.on("mouseover", function(d) {
          //d3.select(this).select('circle').attr("r", 10)
        });

        this.nodeSelector.on("mouseout", function(d) {
        });

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
                    .force("link", d3.forceLink().id(d => d.index) )
                    //.force("link", d3.forceLink().id(d => d.id) )
                    .force("charge", d3.forceManyBody().theta(0.1).strength(-10).distanceMax(this.distance))
                    .force("center", d3.forceCenter(this.width / 2, this.height / 2));

        this.simulation = simulation;
    }
    
    init(){
        this.createSimulation();
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
    
    wakeup(){
        this.simulation.restart();
    }

    tick(){
        this.linkSelector
            .attr("x1", d => d.source.x )
            .attr("y1", d => d.source.y )
            .attr("x2", d => d.target.x )
            .attr("y2", d => d.target.y );

        this.nodeSelector
            .classed("is-tentative", d => d.tentative)
            .classed("is-obstacle", d => d.obstacle)
            .attr("transform", d =>  "translate(" + d.x + "," + d.y + ")")
            .select("circle")
            .style("fill", getNodeColor)

    }
}

export default GraphDrawer;