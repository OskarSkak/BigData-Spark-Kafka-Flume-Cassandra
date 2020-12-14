import React, { useRef, useEffect, useState, Fragment } from "react";
import mapboxgl from 'mapbox-gl';
import usStates from '../us-states.json'
import "./component.css"

import methods from "./methods";
import paints from './paints';
import {renderCovidLayers, renderStateLayers, renderHeatmap, renderNewsCorrelatedHeatmap} from "./RenderLayers";
import WebsocketManager from "./WebsocketManager";
import { timeout } from "d3";

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';
class HeatMap extends React.Component {

  newsCorrelatedData = {type: "FeatureCollection", features: []};
  coronaCorrelatedData = {type: "FeatureCollection", features: []};

  constructor(props) {
    super(props)
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2,
      map: null,
      twitts:{type: "FeatureCollection",features:this.heatmapData},
      isCovidDataToggled:false,
      isCronaStreamToggled:false,
      isNewsCorralatedToggled: false,
      covidData: null,

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
    //this.paintHeatmap();
  }

  paintStates = () => {
    this.state.map?.addSource("StateSource", {
      type: "geojson",
      data: usStates
    })
    renderStateLayers(this.state.map, "StateSource")
  }

  fetchCovid = async () => {
    const covidData = await methods.fetchCovidData();
    this.setState({covidData: covidData}, () => this.plotCovidData(covidData))
  }
  
  plotCovidData = (data) => {
    
    this.state.map?.addSource("CovidSource", {
      type: "geojson",
      data: data.features
    })

    renderCovidLayers(this.state.map, "CovidSource");
  }

  removeCovidData = () => {
    try {
      this.state.map?.removeLayer("CovidUnclusteredLayer")
      this.state.map?.removeLayer("CovidCountLayer")
      this.state.map?.removeSource("CovidSource")
    } catch (err) {
      console.log(err);
    }
  }

  plotNewsCorrelatedHeatmap = () => {
    this.state.map?.addSource("NewsCorrelatedSource", {
      type: "geojson",
      data: this.newsCorrelatedData
    })
    renderHeatmap(this.state.map, "NewsCorrelatedSource");
  }

  removeNewsCorrelatedHeatmap = () => {
    console.log("removing")
    try {
      this.state.map?.removeLayer("earthquakes-point");
      this.state.map?.removeLayer("earthquakes-heat");
      this.state.map?.removeSource("NewsCorrelatedSource");
      this.newsCorrelatedData.features = [];
    } catch (err) {
      console.log(err);
    }
  }

  /*paintHeatmap = () => {
    this.state.map?.addSource('earthquakes', {
      'type': 'geojson',
      'data': this.heatmapData
    });
    renderNewsCorrelatedHeatmap(this.state.map, "earthquakes")
  }*/

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
      if(this.state.isNewsCorralatedToggled) {
        let center = this.getCenter(msg.place.bounding_box.coordinates);
        let feature = {type: "Feature", properties: { city: msg.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
        this.newsCorrelatedData.features.push(feature);
        this.state.map?.getSource("earthquakes")?.setData(this.newsCorrelatedData);
      }

      /*if(this.state.isCronaStreamToggled) {
        let center = this.getCenter(msg.place.bounding_box.coordinates);
        let feature = {type: "Feature", properties: { city: msg.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
        this.coronaCorrelatedData.features.push(feature);
        this.state.map?.getSource("CoronaSource").setData(this.coronaCorrelatedData);
      }*/
      
      /*this.heatmapData.features.push(feature);
      this.state.map?.getSource("earthquakes")?.setData(this.heatmapData);
      console.log(this.state.map?.getSource("earthquakes"))*/
    }
  }

  getCenter = (bounding_box) => {
    let long = (bounding_box[0][0][0]+bounding_box[0][2][0]) / 2;
    let lat = (bounding_box[0][0][1]+bounding_box[0][1][1]) / 2;
    return {long, lat};
  }

  handleCoronaEvent = (event) => {
    //console.log("Corona stream")
    //console.log(event)
  }

  handleNewsCorrelated = (event) => {
    if(this.state.isNewsCorralatedToggled) {
      let center = this.getCenter(event.place.bounding_box.coordinates);
      let feature = {type: "Feature", properties: { city: event.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
      this.newsCorrelatedData.features.push(feature);
      this.state.map?.getSource("NewsCorrelatedSource")?.setData(this.newsCorrelatedData);
    }
  }

  toggleNewsCorrlated = () => {
    if(this.state.isNewsCorralatedToggled) {
      // Remove data
      this.removeNewsCorrelatedHeatmap();
    } else {
      // Add data
      this.plotNewsCorrelatedHeatmap();
    }
    this.setState({isNewsCorralatedToggled: !this.state.isNewsCorralatedToggled})
  }

  toggleCoronaStream = () => {

  }

  toggleCovidData = () => {
    if(this.state.isCovidDataToggled) {
      // Remove data
      this.removeCovidData();
    } else {
      // Add data
      if(this.state.covidData) {
        this.plotCovidData(this.state.covidData)
      } else {
        this.fetchCovid()
      }
    }
    this.setState({isCovidDataToggled: !this.state.isCovidDataToggled})
  }

  render = () => {
    return (
      <Fragment>
        <div ref={el => this.mapContainer = el} />
        <>
        <form>
        <div className="checkFrom">
          <div className="radio">
            <label>
              <input type="radio" value="option1" onClick={this.toggleCovidData} checked={this.state.isCovidDataToggled} />
              Covid data
            </label>
          </div>
          <div className="radio">
          <label>
            <input type="radio" value="option1" onClick={this.toggleCoronaStream} checked={this.state.isCronaStreamToggled} />
            Corona stream
          </label>
          </div>
          <div className="radio">
          <label>
            <input type="radio" value="option1" onClick={this.toggleNewsCorrlated} checked={this.state.isNewsCorralatedToggled} />
            news corraltion
          </label>
          </div>
        </div>
        </form>
        </>
        <WebsocketManager subscribeCorona={msg => this.handleCoronaEvent(msg)} subscribeNews={msg => this.handleNewsCorrelated(msg)}></WebsocketManager>
      </Fragment>
    );
  }
};
  
export default HeatMap;


/*
{props.states === 'twitter' ? 
              mapContainerRef.current?.on("load", () => {
              // add the data source for new a feature collection with no features
              mapContainerRef.current?.addSource("trees", {
                type: "geojson",
                data: trees
              });
              // now add the layer, and reference the data source above by name
              mapContainerRef.current?.addLayer({
                id: 'trees-heat',
                type: 'heatmap',
                source: 'trees',
                maxzoom: 15,
                paint: paints.heatMapPaint
              }, 'waterway-label');
              mapContainerRef.current?.addLayer({
                id: 'trees-point',
                type: 'circle',
                source: 'trees',
                minzoom: 14,
                paint: paints.circleHeatPaint
              }, 'waterway-label');
          }) : null} */