import React, { Component } from 'react'
import './component.css';

export default class NavBar extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <div className="navContainer">
                <button onClick={()=> {alert('Twitter')}}>
                    Twitter
                </button>
                <button onClick={()=> {alert('Covid')}}>
                    Covid
                </button>
                <button onClick={()=> {alert('Correlation')}}>
                    Correlation
                </button>
            </div>
        )
    }
}