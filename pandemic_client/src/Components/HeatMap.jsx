import React, { Component } from "react";
import DisplayMapData from './d3/DisplayMapData'
import DrawMap from './d3/DrawMap'

export default class HeatMap extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            countryResults:"",
        }
    }

    componentDidMount = () => {
        DrawMap();
    }


    
    render() {
        return (
            <div className="mapviz">
                
            </div>
        )
    }
}
