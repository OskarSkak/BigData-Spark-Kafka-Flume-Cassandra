import React, { useRef, useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';
import usStates from '../us-states.json'
import "./component.css"

import methods from "./methods";
import paints from './paints';
import {renderCovidLayers} from "./RenderLayers";

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';
class HeatMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 2,
      map: null
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

    this.state.map?.addLayer({
      'id': 'StateSourceLayer',
      'type': 'fill',
      'source': 'StateSource',
      'layout': {},
      'paint': paints.electionPaint
    })
    this.state.map?.addLayer({
      "id": "StateSourceLineLayer",
      "type": "line", 
      "source": "StateSource",
      "layout": {},
      "paint": paints.linePaint
    })
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

  render = () => {
    return (
      <div ref={el => this.mapContainer = el} />
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