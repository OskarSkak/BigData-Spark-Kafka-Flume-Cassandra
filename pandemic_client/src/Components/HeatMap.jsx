import React, { useRef, useEffect, useState, Fragment } from "react";
import mapboxgl from 'mapbox-gl';
import usStates from '../us-states.json'
import "./component.css"

import methods from "./methods";
import paints from './paints';
import {renderCovidLayers, renderStateLayers, renderHeatmap} from "./RenderLayers";
import WebsocketManager from "./WebsocketManager";
import { timeout } from "d3";

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';
class HeatMap extends React.Component {

  heatmapData = {type: "FeatureCollection", features: []};

  constructor(props) {
    super(props)
    this.state = {
      lng: -98.93,
      lat: 39.79,
      zoom: [3.5],
      map: null,
      twitts:{type: "FeatureCollection",features:this.heatmapData},
      isCovidDataToggled:false,
      isCronaStreamToggled:false,
      isNewsCorralatedToggled: false,
      isHistoricDataToggled: false
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });
    this.setState({map: map});
    // Bind eventhandlers to map below
    map.on("load", this.onMapLoad)
  }

  onMapLoad = () => {
    this.paintStates();
    //this.fetchCovid();
    this.paintHeatmap();
  }

  fetchCovid = async () => {
    const covidData = await methods.fetchCovidData();
    this.plotCovidData(covidData);
  }
  
  plotCovidData = (data) => {
    console.log(data);
    this.state.map?.addSource("CovidSource", {
      type: "geojson",
      data: data.features,
      //cluster: true,
      //clusterMaxZoom: 14, // Max zoom to cluster points on
      //clusterRadius: 50
    })
    renderCovidLayers(this.state.map, "CovidSource");
  }

  paintStates = () => {
    this.state.map?.addSource("StateSource", {
      type: "geojson",
      data: usStates
    })
    renderStateLayers(this.state.map, "StateSource")
  }

  paintHeatmap = () => {
    this.state.map?.addSource('earthquakes', {
      'type': 'geojson',
      'data': this.heatmapData
    });
    renderHeatmap(this.state.map, "earthquakes")
  }

  clearMap = () => {
    try {
      this.state.map?.removeLayer("CovidUnclusteredLayer")
      this.state.map?.removeLayer("CovidCountLayer")
      this.state.map?.removeSource("CovidSource")
    } catch(err) {
      console.log(err);
    }
  }

  handleWebsocket = (msg) => {
    if(msg.place.bounding_box.coordinates != null) {
      let center = this.getCenter(msg.place.bounding_box.coordinates);
      let feature = {type: "Feature", properties: { city: msg.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
      this.heatmapData.features.push(feature);
      this.state.map?.getSource("earthquakes")?.setData(this.heatmapData);
      console.log(this.state.map?.getSource("earthquakes"))
    }
  }

  getCenter = (bounding_box) => {
    let long = (bounding_box[0][0][0]+bounding_box[0][2][0]) / 2;
    let lat = (bounding_box[0][0][1]+bounding_box[0][1][1]) / 2;
    return {long, lat};
  }

  toggleNewsCorrlated = () => {
    console.log("news")
    this.setState({isNewsCorralatedToggled: !this.state.isNewsCorralatedToggled})
  }

  toggleCoronaStream = () => {
    console.log("corona")
    this.setState({isCronaStreamToggled: !this.state.isCronaStreamToggled})
  }

  toggleCovidData = () => {
    console.log('covid')
    this.setState({isCovidDataToggled: !this.state.isCovidDataToggled})
    
  }

  toggleHistoricData = () =>{
    this.setState({isHistoricDataToggled: !this.state.isHistoricDataToggled})
    console.log("Historical data")
  }
  


  render = () => {
    return (
      <Fragment>
        <div ref={el => this.mapContainer = el} />
        <>
        <form>
          <div className="checkFrom">
          <text style={{padding:"10px"}}>Visiulization parameters:</text>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleCovidData} checked={this.state.isCovidDataToggled} />
                  Covid data
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleCoronaStream} checked={this.state.isCronaStreamToggled} />
                  Corona stream
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleNewsCorrlated} checked={this.state.isNewsCorralatedToggled} />
                  news corraltion
              </label>
            </div>
            <div className="radio">
            <label>
              <input type="checkbox" value="option1" onClick={this.toggleHistoricData} checked={this.state.isHistoricDataToggled} />
                Histroical data
            </label>
            </div>
          </div>
        </form>
        </>
        <WebsocketManager subscribeWebsocket={msg => this.handleWebsocket(msg)}></WebsocketManager>
      </Fragment>
    );
  }
};
  
export default HeatMap;