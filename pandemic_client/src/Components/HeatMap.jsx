import React, { Component } from 'react'
import './component.css';
//import node from './diagram';
//import rd3 from 'react-d3-library';
//const RD3Component = rd3.Component;

export default class HeatMap extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             d3:"",
        }
    }

    componentDidMount = () => {
        //this.setState({d3: node});
      }
    
    render() {
        return (
            <div className='heatMap'>
                
            </div>
        )
    }
}
