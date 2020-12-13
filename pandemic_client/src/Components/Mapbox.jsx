import React, { useState } from "react";
import ReactMapboxGl,{GeoJSONLayer, Cluster, Layer} from 'react-mapbox-gl';
import {ReactMapboxGlCluster} from 'react-mapbox-gl-cluster';
import States from './us_state_capitals.json';
import usStates from '../us-states.json';

const MapContainer = ReactMapboxGl({
    accessToken: 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g',
});
    const circleLayout = { visibility: 'visible' };
    const circlePaint = {
        'circle-color': '#fa5757',/*[
            'step',
                ['get', 'posetive'],
                '#02ed17',
                100000,
                '#04540b',
                200000,
                'blue',
                300000,
                "#db022a",
                400000,
                '#540312'
            ],*/
            'circle-radius': [
            'step',
                ['get', 'posetive'],
                15,
                100000,
                20,
                200000,
                25,
                300000,
                30,
                400000,
                35
            ]
    };
    const heatmapPaint = {
        // Increase the heatmap weight based on frequency and property magnitude
        'heatmap-weight': [
            'interpolate',
                ['linear'],
                ['get', 'mag'],
                0,
                0,
                6,
                1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
            'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                9,
                3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparancy color
        // to create a blur-like effect.
        'heatmap-color': [
            'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
            'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                9,
                20
        ],
        // Transition from heatmap to circle layer by zoom level
        'heatmap-opacity': [
            'interpolate',
                ['linear'],
                ['zoom'],
                7,
                1,
                9,
                0
                ]
        }
         
        
  //  : MapboxGL.CirclePaint 
  //: MapboxGL.SymbolLayout  MapboxGL.SymbolPaint
const symbolLayout= { 
    'text-field': '{posetive}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 10
 };
const symbolPaint = {'text-color':'white'}


const fillPain = {
    'fill-color': ['get', 'color'],
    'fill-opacity': [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    1,
    0.5
    ]
    }

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapProps: "",
            lng: -98.93,
            lat: 39.79,
            zoom: [3.5],
            features:{},
            tweets:{features:{type: "FeatureCollection",features:[]}}
                    
        }
    }
     
    
    componentDidMount = async() => {
        const mapProps = ({
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });
        //map.on("click", this.onClickHandler)
        this.setState({mapProps: mapProps})
        await this.fetchData();
    }
    

    fetchData = async () => {
        let respons = await fetch('https://api.covidtracking.com/v1/states/current.json')
        let data = await respons.json();
        let features = [];
        data.forEach(ele => {
            var state = States[ele.state]
            if(state) {
                let feature = {
                    type: "Feature",
                    properties: { state: ele.state , posetive: ele.positive}, geometry: { type: "Point", coordinates: [ state.long, state.lat] } }
                features.push(feature)
            }
            }
        );
        this.setState({features:{type: "FeatureCollection",features:features}})
    }
    
    render = () => {
        console.log("state: ",this.props.states)
        console.log("Tweet: ",this.props.tweets)
        return (
            <div>
                <MapContainer 
                    {...this.state.mapProps}
                    containerStyle={{
                        height: "95.5vh",
                        width: '100vw'}} >
                            <GeoJSONLayer
                                data={usStates}
                                fillPaint={fillPain}
                                linePaint={{'line-color': '#627BC1','line-width': 2}}
                            />
                      { this.props.states === 'covid' ?
                        <>  
                            <GeoJSONLayer
                                data={this.state.features}
                                circleLayout={circleLayout}
                                circlePaint={circlePaint}
                            />
                            <GeoJSONLayer
                                data={this.state.features}
                                symbolPaint={symbolPaint}
                                symbolLayout={symbolLayout}
                            /> 
                        </>
                        : null}
                        { this.props.states === 'twitter'  ?
                        <>
                            
                        </>: null}
                        {this.props.states === 'correlation' ? 
                        <>
                            <Layer 
                                geoJSONSourceOptions = {{"type":"geojson", 'data':this.props.tweets}}
                                type="heatmap"
                                paint={heatmapPaint}/>
                        </>: null }
                </MapContainer>
            </div>
        );
       
    }
}

export default Map;