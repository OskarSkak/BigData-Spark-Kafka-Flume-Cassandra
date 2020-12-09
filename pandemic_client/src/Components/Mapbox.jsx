import React from "react";
import ReactMapboxGl,{GeoJSONLayer} from 'react-mapbox-gl';
import {ReactMapboxGlCluster} from 'react-mapbox-gl-cluster';
import States from './us_state_capitals.json'

const MapContainer = ReactMapboxGl({
    accessToken: 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g',
});
    const circleLayout = { visibility: 'visible' };
    const circlePaint = {
        'circle-color': [
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
            ],
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
    'text-size': 12
 };
const symbolPaint = {'text-color':'white'}

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapProps: "",
            lng: -98.93,
            lat: 39.79,
            zoom: [3.5],
            features: {type: "FeatureCollection",
                        features:[]},
            showCovid: false,
            showTwitter: false,
        }
    }
     
    
    componentDidMount() {
        const mapProps = ({
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom,
        });
        //map.on("click", this.onClickHandler)
        this.setState({mapProps: mapProps})
        this.fetchData();
    }
    

    fetchData = async () => {
        let respons = await fetch('https://api.covidtracking.com/v1/states/current.json')
        let data = await respons.json();
        data.forEach(ele => {
            var state = States[ele.state]
            if(state) {
                let feature = {
                    type: "Feature",
                    properties: { state: ele.state , posetive: ele.positive}, geometry: { type: "Point", coordinates: [ state.long, state.lat] } }
                    this.state.features.features.push(feature);
            }
            }
        )
    }
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
                        <React.Fragment>
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
                        </React.Fragment>: null}
                        { this.props.states === 'twitter' ?
                        <React.Fragment>
                            
                        </React.Fragment>: null}
                        { this.props.states === 'correlation' ?
                        <React.Fragment>
                            
                        </React.Fragment>: null}
                        
                </MapContainer>
            </div>
        )

    }
}

export default Map;