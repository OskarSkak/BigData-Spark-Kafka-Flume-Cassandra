import React, { Component } from 'react';
import DisplayMapData from './d3/DisplayMapData'
import './component.css';

export default class NavBar extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            contryResults: "",
        }
    }

    componentDidMount = async() => {
        
    }
    
    render() {
        return (
            <div className="navContainer">
                <button onClick={()=> {alert('Twitter')}}>
                    Twitter
                </button>
                <button onClick={(event) => DisplayMapData(event.target.value, event.target.innerText, this.state.contryResults)}>
                    Covid
                </button>
                <button onClick={()=> {alert('Correlation')}}>
                    Correlation
                </button>
            </div>
        )
    }
}