import * as d3 from "d3";

export default class DijkstraRunner {
    constructor(graph, links){
        this.events = d3.dispatch("update", "completed");

        this.unvisited = [];
        this.nodes = graph.nodes;
        this.links = graph.links;

        this.step = this.step.bind(this);
    }

    
    step(){
        this.events.call('update');
        this.current.visited = true;
        this.current.tentative = false;
        //check all neighbours of the current node
        this.current.links.forEach( link => {
            let target = link.target;
            
            if(target.obstacle) {
                //skip and mark as visited
                 target.visited = true;

            }else if (target.visited == false) {
                target.tentative = true;
                //calculate distance to that node (tentative)
                let distance = this.current.distance + link.cost;
                //assign smaller value if target node can be reached by another node with smaller cost
                target.distance = Math.min(distance, target.distance); 
            }
        });

        // cancel if nothing is left OR we have only not connected nodes left to check
        if (this.unvisited.length == 0 || this.current.distance == Infinity) {

            if(this.timer){
                this.timer.stop();
                this.timer = null;    
            }
            this.events.call('completed');
            
            return;
        }
        
        //sort to access by minimal distance
        this.unvisited.sort(function(a, b) {
            return b.distance - a.distance 
        });

        // continue with next node which has the smallest distance to the current one
        this.current = this.unvisited.pop()
    }

    reset(){
        this.startNode = this.nodes[0];

        this.nodes.forEach(node => {
            node.links = [];

            if (node != this.startNode) {
                node.distance = Infinity;
                node.visited = false;
                
                this.unvisited.push(node);
            }
        });

        this.links.forEach(link => {
            link.cost = 1;
            if(typeof link.source != 'object') {
                link.source = this.nodes[link.source];
            }
            if(typeof link.target != 'object') {
                link.target = this.nodes[link.target];
            }
            
            link.source.links.push(link);
        })

        this.unvisited.forEach(node => node.distance = Infinity);

        this.startNode.distance = 0;
        this.current = this.startNode
    }

    start(){
        this.reset();
    }
    run(){
        this.reset();
        this.timer = d3.timer(this.step);   
    }
}
