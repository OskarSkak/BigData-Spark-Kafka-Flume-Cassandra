import React, { useState } from "react";
import ReactMapboxGl,{GeoJSONLayer, Cluster, Layer, MapContext, Feature} from 'react-mapbox-gl';
import {ReactMapboxGlCluster} from 'react-mapbox-gl-cluster';
//import States from './us_state_capitals.json';
//import usStates from '../us-states.json';
import trees from '../trees.json'

const MapContainer = ReactMapboxGl({
    accessToken: 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g',
});
    const circleLayout = { visibility: 'visible' };
    const circlePaint = {
        'circle-color': '#fa5757',
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
        const circleHeatPain = {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                16,
                ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                ],
                // Color circle by earthquake magnitude
                'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                1,
                'rgba(33,102,172,0)',
                2,
                'rgb(103,169,207)',
                3,
                'rgb(209,229,240)',
                4,
                'rgb(253,219,199)',
                5,
                'rgb(239,138,98)',
                6,
                'rgb(178,24,43)'
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                // Transition from heatmap to circle layer by zoom level
                'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7,
                0,
                8,
                1
                ]
        };
        const layerPaint = {
            'heatmap-weight': {
              property: 'priceIndicator',
              type: 'exponential',
              stops: [[0, 0], [5, 2]]
            },
            // Increase the heatmap color weight weight by zoom level
            // heatmap-ntensity is a multiplier on top of heatmap-weight
            'heatmap-intensity': {
              stops: [[0, 0], [5, 1.2]]
            },
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.25,
              'rgb(103,169,207)',
              0.5,
              'rgb(209,229,240)',
              0.8,
              'rgb(253,219,199)',
              1,
              'rgb(239,138,98)',
              2,
              'rgb(178,24,43)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': {
              stops: [[0, 1], [5, 50]]
            }
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
            tweets:{type: "FeatureCollection",features:[]}
                    
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
    addTweets = async() => {
        /*let array = this.state.tweets.features.slice();
        array[index] = e.target.value;
        const newOb = {...this.state.tweets, features:array}
        console.log(newOb)*/
        let tweet = await this.props.tweets;
        let old = this.state.tweets;
        try{
            old.features.push({type: "Feature", properties: { city: tweet.place.full_name }, geometry: { type: "Point", coordinates: [ tweet.place.bounding_box.coordinates[0][0] ]} });

        } catch(err)
        {
            console.log(err);
        }
        
        
        
        //this.setState({tweets:old})

        console.log("add",this.state.tweets)
        
             // create mutable copy of the array
             // set the value of the feature at the index in question to e.target.value
            // create a new object by spreading in the this.state.car and overriding features with our new array 
            
          
    }
    
    render = () => {
        //console.log("state: ",this.props.states)
        //console.log("Tweet: ",this.props.tweets)
        console.log("eat: ",trees)
        this.addTweets();
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
                            data={trees}
                            heatmapPaint={{
                                // increase weight as diameter breast height increases
                                'heatmap-weight': {
                                  property: 'dbh',
                                  type: 'exponential',
                                  stops: [
                                    [1, 0],
                                    [62, 1]
                                  ]
                                },
                                // increase intensity as zoom level increases
                                'heatmap-intensity': {
                                  stops: [
                                    [11, 1],
                                    [15, 3]
                                  ]
                                },
                                // assign color values be applied to points depending on their density
                                'heatmap-color': [
                                  'interpolate',
                                  ['linear'],
                                  ['heatmap-density'],
                                  0, 'rgba(236,222,239,0)',
                                  0.2, 'rgb(208,209,230)',
                                  0.4, 'rgb(166,189,219)',
                                  0.6, 'rgb(103,169,207)',
                                  0.8, 'rgb(28,144,153)'
                                ],
                                // increase radius as zoom increases
                                'heatmap-radius': {
                                  stops: [
                                    [11, 15],
                                    [15, 20]
                                  ]
                                },
                                // decrease opacity to transition into the circle layer
                                'heatmap-opacity': {
                                  default: 1,
                                  stops: [
                                    [14, 1],
                                    [15, 0]
                                  ]
                                },
                              }}
                            />
                            <GeoJSONLayer
                            data={trees}
                            circlePaint={{
                                // increase the radius of the circle as the zoom level and dbh value increases
                                'circle-radius': {
                                  property: 'dbh',
                                  type: 'exponential',
                                  stops: [
                                    [{ zoom: 15, value: 1 }, 5],
                                    [{ zoom: 15, value: 62 }, 10],
                                    [{ zoom: 22, value: 1 }, 20],
                                    [{ zoom: 22, value: 62 }, 50],
                                  ]
                                },
                                'circle-color': {
                                  property: 'dbh',
                                  type: 'exponential',
                                  stops: [
                                    [0, 'rgba(236,222,239,0)'],
                                    [10, 'rgb(236,222,239)'],
                                    [20, 'rgb(208,209,230)'],
                                    [30, 'rgb(166,189,219)'],
                                    [40, 'rgb(103,169,207)'],
                                    [50, 'rgb(28,144,153)'],
                                    [60, 'rgb(1,108,89)']
                                  ]
                                },
                                'circle-stroke-color': 'white',
                                'circle-stroke-width': 1,
                                'circle-opacity': {
                                  stops: [
                                    [14, 0],
                                    [15, 1]
                                  ]
                                }
                              }}/>
                        </>: null}
                        {this.props.states === 'correlation' ? 
                        <>
                            <Layer type='heatmap' paint={heatmapPaint}>
                                {trees.features.forEach(ele => {
                                    <Feature coordinates={[ele.geometry.coordinates[0], ele.geometry.coordinates[1]]} />
                                })}
                            </Layer>

                           <GeoJSONLayer
                                data={usStates}
                                fillPaint={fillPain}
                                linePaint={{'line-color': '#627BC1','line-width': 2}}
                            />
                        </>: null }
                </MapContainer>
            </div>
        );
       
    }
}

export default Map;




/*<Layer 
                                sourceId="source_id"
                                type="heatmap"
                                paint={heatmapPaint}
                                maxZoom={9}/>
                            <Layer 
                                sourceId="source_id"
                                type="circle"
                                paint={circleHeatPain}
                                minZoom={7} /> 
                           */