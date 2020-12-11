import React, { useState } from "react";
import ReactMapboxGl,{GeoJSONLayer, Cluster} from 'react-mapbox-gl';
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
        console.log("DID1", this.state.features.features)
        console.log("DID2", this.state.features.features[0].geometry)
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
        console.log("features", this.state.features.features)
    }

    renderList = () => {
        
        console.log("hhh", this.state.features.features[3]) 
    };

    render = () => {
        console.log(this.props.states)
        return (
            <div>
                <MapContainer 
                    {...this.state.mapProps}
                    containerStyle={{
                        height: "95.5vh",
                        width: '100vw'}} >
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
                            <GeoJSONLayer
                                data={usStates}
                                //fillLayout={}
                                fillPaint={fillPain}
                                linePaint={{'line-color': '#627BC1','line-width': 2}}
                            />
                            
                        </>: null}                
                </MapContainer>
            </div>
        );
       
    }
}

export default Map;