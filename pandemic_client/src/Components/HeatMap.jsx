import React, { useRef, useEffect, useState, Fragment } from "react";
import mapboxgl from 'mapbox-gl';
import usStates from '../us-states.json'
import "./component.css"
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography';

import methods from "./methods";
import paints from './paints';
import {renderCovidLayers, renderStateLayers, renderNegativeCoronaHeatmap, renderPositiveCoronaHeatmap} from "./RenderLayers";
import WebsocketManager from "./WebsocketManager";
import { timeout } from "d3";

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';
class HeatMap extends React.Component {

  positiveCoronaData = {type: "FeatureCollection", features: []};
  negativeCoronaData = {type: "FeatureCollection", features: []};

  positiveNewsData = {type: "FeatureCollection", features: []};
  negativeNewsData = {type: "FeatureCollection", features: []};

  historicNewsCorrelatedData = {type: "FeatureCollection", features: []}
  coronaCorrelatedData = {type: "FeatureCollection", features: []};
  historicCoronaCorrelatedData = {type: "FeatureCollection", features: []};

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
      isHistoricDataToggled: false,
      isStatesToggled: false,
      dateSlider:[50,1 ],
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
    this.setState({isStatesToggled: true})
    this.paintStates();

    // Initialize the different heatmaps
    this.plotPositiveCoronaHeatmap();
    this.plotNegativeCoronaHeatmap();
  }

  paintStates = () => {
    this.state.map?.addSource("StateSource", {
      type: "geojson",
      data: usStates
    })
    renderStateLayers(this.state.map, "StateSource")
  }

  removePaintStates = () => {
    try {
      this.state.map?.removeLayer("StateSourceLayer");
      this.state.map?.removeLayer("StateSourceLineLayer");
      this.state.map?.removeSource("StateSource");
    } catch(err) {
      console.log(err);
    }
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

  plotPositiveCoronaHeatmap = () => {
    this.state.map?.addSource("PositiveCoronaHeatmapSource", {
      type: "geojson",
      data: this.positiveCoronaData
    })
    renderPositiveCoronaHeatmap(this.state.map, "PositiveCoronaHeatmapSource");
    this.state.map?.on("click", 'PositiveCoronaHeatmap-point', this.onPositiveHeatmapClicked)
  }

  onPositiveHeatmapClicked = (e) => {
      new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML('<b>DBH:</b> ' + e.features[0].properties.dbh)
          .addTo(this.state.map);
  }

  removePositiveCoronaHeatmap = () => {
    try {
      this.state.map?.off("click", "PositiveCoronaHeatmap-point", this.onPositiveHeatmapClicked)
      this.state.map?.removeLayer("PositiveCoronaHeatmap-point");
      this.state.map?.removeLayer("PositiveCoronaHeatmap-heat");
      this.state.map?.removeSource("PositiveCoronaHeatmapSource");
      this.positiveCoronaData.features = [];
    } catch (err) {
      console.log(err);
    }
  }

  plotNegativeCoronaHeatmap = () => {
    this.state.map?.addSource("NegativeCoronaSource", {
      type: "geojson",
      data: this.coronaCorrelatedData
    })
    renderNegativeCoronaHeatmap(this.state.map, "NegativeCoronaSource");
  }

  removeNegativeCoronaHeatmap = () => {
    try {
      this.state.map?.removeLayer("NegativeCorona-heat");
      this.state.map?.removeLayer("NegativeCorona-point");
      this.state.map?.removeSource("NegativeCoronaSource")
      this.negativeCoronaData.features = [];
    } catch(err) {
      console.log(err)
    }
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

  getCenter = (bounding_box) => {
    let long = (bounding_box[0][0][0]+bounding_box[0][2][0]) / 2;
    let lat = (bounding_box[0][0][1]+bounding_box[0][1][1]) / 2;
    return {long, lat};
  }

  handleCoronaEvent = (event) => {
    console.log("handle corona")
    if(this.state.isCronaStreamToggled) {
      console.log(event);
      let center = this.getCenter(event.place.bounding_box.coordinates);
      let feature = {type: "Feature", properties: { type: "stream", city: event.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}

      if(event.sentiment.prediction === "Positive") {
        this.positiveCoronaData.features.push(feature);
        this.state.map?.getSource("PositiveCoronaHeatmapSource")?.setData(this.positiveCoronaData);
      } else {
        this.negativeCoronaData.features.push(feature);
        this.state.map?.getSource("NegativeCoronaSource")?.setData(this.negativeCoronaData);
      }
    }
  }

  handleNewsCorrelated = (event) => {
    if(this.state.isNewsCorralatedToggled) {
      console.log(event);
      /*let center = this.getCenter(event.place.bounding_box.coordinates);
      let feature = {type: "Feature", properties: { city: event.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
      this.newsCorrelatedData.features.push(feature);
      this.state.map?.getSource("NewsCorrelatedSource")?.setData(this.newsCorrelatedData);*/
    }
  }

  /*toggleNewsCorrlated = () => {
    if(this.state.isNewsCorralatedToggled) {
      // Remove data
      this.removeNewsCorrelatedHeatmap();
    } else {
      // Add data
      this.plotNewsCorrelatedHeatmap();
    }
    this.setState({isNewsCorralatedToggled: !this.state.isNewsCorralatedToggled})
  }
*/
  toggleCoronaStream = () => {
    console.log("toggle corona")
    if(this.state.isCronaStreamToggled) {
      // Remove live data from both positive and negative tweets

    } else {
      // Start adding tweets to both positive and negative tweets

    }
    this.setState({isCronaStreamToggled: !this.state.isCronaStreamToggled})
  }

  toggleHistoricCoronaData = async () => {

    if(this.state.isHistoricDataToggled) {
      // Remove data



    } else {
      // Add data
      //let result = await methods.
    }

    this.setState({isCoronaHistoricDataToggled: !this.state.isHistoricDataToggled})
  }

  toggleHistoricNewsCorrelatedData = () => {
    this.setState({isNewsCorrelatedHistoricToggled: !this.state.isNewsCorrelatedHistoricToggled})
  }

  render = () => {
    return (
      <Fragment>
        <div ref={el => this.mapContainer = el} />
        <>
        <form>
          <div className="checkFrom">
          <h4 style={{padding:"10px"}}>Visualization parameters:</h4>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleStatesData} checked={this.state.isStatesToggled} />
                State Boundaries
              </label>
            </div>
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
                <input type="checkbox" value="option1" onClick={this.toggleCoronaStream} checked={this.state.isCronaStreamToggled} />
                  Corona Historic
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
            <div style={{padding:"0 20px", textAlign:"center"}}>
            <Typography id="range-slider" gutterBottom>
              Get data between {(this.state.dateSlider[1] - 50) * -1} and {(this.state.dateSlider[0] -50) * -1} days ago
            </Typography>
            <Slider 
              value={this.state.dateSlider}
              onChange={this.handleSlider}
              //valueLabelDisplay="auto"
              //aria-labelledby="range-slider"
              //getAriaValueText={this.handleText}
              max={50}
              min={1}
            />
            </div>
          </div>
        </form>
        </>
        <WebsocketManager subscribeCorona={msg => this.handleCoronaEvent(msg)} subscribeNews={msg => this.handleNewsCorrelated(msg)}></WebsocketManager>
      </Fragment>
    );
  }

  toggleStatesData = () => {
    if(this.state.isStatesToggled) {
      this.removePaintStates();
    } else {
      this.paintStates();
    }
    this.setState({isStatesToggled: !this.state.isStatesToggled})
  }

  handleSlider = (event, newVal) => {
    this.setState({dateSlider: newVal})
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
};
  
export default HeatMap;
