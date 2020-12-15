import React, { Component } from 'react';
import './component.css';

export default class NavBar extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            contryResults: "",
        }
    }

    handleState = (states) => {
        this.props.setStates(states);
   }
    
    render() {
        return (
            <div className="navContainer">
                <button onClick={() =>this.handleState('twitter')}>
                    Twitter
                </button>
                <button onClick={() => this.handleState('covid')}>
                    Covid
                </button>
                <button onClick={() => this.handleState('correlation')}>
                    Correlation
                </button>
                <button onClick={() => this.handleState('clear')}>
                    Clear
                </button>
            </div>
        )
    }
}