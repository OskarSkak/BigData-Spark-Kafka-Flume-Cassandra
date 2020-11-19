import React, { Component } from 'react'
import './component.css';
//import node from './diagram';
import d3 from 'd3';
import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

export default class HeatMap extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             d3:"",
        }
    }
    

    componentDidMount = () => {
        let node = document.createElement('div');

        var width = '960px',
            height = '500px';

        var svg = d3.select(node).append("svg")
            .attr("width", width)
            .attr("height", height);

        var defs = svg.append("defs");

        defs.append("clipPath")
            .attr("id", "circle1")
        .append("circle")
            .attr("cx", 350)
            .attr("cy", 200)
            .attr("r", 180);

        defs.append("clipPath")
            .attr("id", "circle2")
        .append("circle")
            .attr("cx", 550)
            .attr("cy", 200)
            .attr("r", 180);

        this.setState({d3: node});

      }
    
    render() {
        console.log("From: ",this.state.d3)
        return (
            <div className='heatMap'>
                <RD3Component data={this.state.d3} />
            </div>
        )
    }
}
