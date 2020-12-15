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
      isHistoricCoronaToggled: false,
      isNewsCorralatedToggled: false,
      isHistoricNewsCorrelatedToggled: false,
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

  plotPositiveNewsHeatmap = () => {
    this.state.map?.addSource("PositiveNewsSource", {
      type: "geojson",
      data: this.positiveCoronaData
    })
    renderPositiveNewsHeatmap(this.state.map, "PositiveNewsSource");
    this.state.map?.on("click", 'PositiveNews-point', this.onPositiveNewsClicked)
  }

  onPositiveNewsClicked = (e) => {
      new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML('<b>DBH:</b> ' + e.features[0].properties.dbh)
          .addTo(this.state.map);
  }

  removePositiveNewsHeatmap = () => {
    try {
      this.state.map?.off("click", "PositiveNews-point", this.onPositiveNewsClicked)
      this.state.map?.removeLayer("PositiveNews-point");
      this.state.map?.removeLayer("PositiveNews-heat");
      this.state.map?.removeSource("PositiveNewsSource");
      this.positiveCoronaData.features = [];
    } catch (err) {
      console.log(err);
    }
  }

  handleNewsCorrelated = (event) => {
    if(this.state.isNewsCorralatedToggled) {
      
      /*let center = this.getCenter(event.place.bounding_box.coordinates);
      let feature = {type: "Feature", properties: { city: event.place.full_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
      this.newsCorrelatedData.features.push(feature);
      this.state.map?.getSource("NewsCorrelatedSource")?.setData(this.newsCorrelatedData);*/
    }
  }

  toggleNewsCorrlated = () => {
    if(this.state.isNewsCorralatedToggled) {
      // Remove data
      this.filterNewsCorrelatedData("stream");
    } else {
      // Add data

    }
    this.setState({isNewsCorralatedToggled: !this.state.isNewsCorralatedToggled})
  }

  toggleHistoricNewsCorrelatedData = () => {
    if(this.state.isHistoricNewsCorrelatedToggled) {
      // Remove stream data from news correlated
      
      // check if layer could be removed
    } else {
      // Start adding news correlated stream data
      // check if layer should be added
    }

    this.setState({isNewsCorrelatedHistoricToggled: !this.state.isNewsCorrelatedHistoricToggled})
  }

  toggleCoronaStream = () => {
    if(this.state.isCronaStreamToggled) {
      // Remove stream data from corona
      this.filterCoronaData("stream");
      // Check if layer could be removed
    } else {
      // Start adding corona stream data
      // Check if layer should be added
    }
    this.setState({isCronaStreamToggled: !this.state.isCronaStreamToggled})
  }

  toggleHistoricCorona = async () => {
    if(this.state.isHistoricCoronaToggled) {
      // remove data
      this.filterCoronaData("historic");
      // Check if layer could be removed
    } else {
      // Fetch historic data
      let result = await methods.fetchHistoricCoronaStream(0,1);
      result.forEach(element => {
        let center = this.getCenter(element.coordinates);
        let feature = {type: "Feature", properties: { type: "historic", city: element.screen_name }, geometry: { type: "Point", coordinates: [center.long, center.lat]}}
        if(element.prediction === "Positive") {
          this.positiveCoronaData.features.push(feature);
        } else {
          this.negativeCoronaData.features.push(feature);
        }
        this.updateCoronaLayerData();
      }) 
      // Check if layer should be added?
    }
    this.setState({isHistoricCoronaToggled: !this.state.isHistoricCoronaToggled});
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
                <input type="checkbox" value="option1" onClick={this.toggleHistoricCorona} checked={this.state.isHistoricCoronaToggled} />
                  Corona Historic
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleNewsCorrlated} checked={this.state.isNewsCorralatedToggled} />
                  News-correlation stream
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="checkbox" value="option1" onClick={this.toggleHistoricNewsCorrelatedData} checked={this.state.isNewsCorrelatedHistoricToggled} />
                  News-correlation historic
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

  getCenter = (bounding_box) => {
    let long = (bounding_box[0][0][0]+bounding_box[0][2][0]) / 2;
    let lat = (bounding_box[0][0][1]+bounding_box[0][1][1]) / 2;
    return {long, lat};
  }

  filterCoronaData = (type) => {
      let negativeCorona = this.negativeCoronaData.features;
      let positiveCorona = this.positiveCoronaData.features; 

      let newNegativeCorona = [];
      let newPositiveCorona = [];

      for(let i = 0; i < negativeCorona.length; i++) {
        if(negativeCorona[i].properties.type !== type) {
          newNegativeCorona.push(negativeCorona[i]);
        }
      }

      for(let i = 0; i < positiveCorona.length; i++) {
        if(positiveCorona[i].properties.type !== type) {
          newPositiveCorona.push(positiveCorona[i]);
        }
      }

      this.negativeCoronaData.features = newNegativeCorona;
      this.positiveCoronaData.features = newPositiveCorona;
      this.updateCoronaLayerData();
  }

  filterNewsCorrelatedData = (type) => {
    let negativeNews = this.negativeNewsData.features;
    let positiveNews = this.positiveNewsData.features;

    let newNegativeNews = [];
    let newPositiveNews = [];

    for(let i = 0; i < negativeNews.length; i++) {
      if(negativeNews[i].properties.type !== type) {
        newNegativeNews.push(negativeNews[i])
      }
    }

    for(let i = 0; i < positiveNews.length; i++) {
      if(positiveNews[i].properties.type !== type) {
        newPositiveNews.push(positiveNews[i]);
      }
    }

    this.positiveNewsData.features = newPositiveNews;
    this.negativeNewsData.features = newNegativeNews;
    this.updateNewsCorrelatedLayerData();
  }

  updateNewsCorrelatedLayerData = () => {
    //this.state.map?.getSource("")
  }

  updateCoronaLayerData = () => {
    this.state.map?.getSource("PositiveCoronaHeatmapSource")?.setData(this.positiveCoronaData);
    this.state.map?.getSource("NegativeCoronaSource")?.setData(this.negativeCoronaData);
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

  clearMap = () => {
    try {
      this.state.map?.removeLayer("CovidUnclusteredLayer")
      this.state.map?.removeLayer("CovidCountLayer")
      this.state.map?.removeSource("CovidSource")
    } catch(err) {
      console.log(err);
    }
  }

  plotNegativeCoronaHeatmap = () => {
    this.state.map?.addSource("NegativeCoronaSource", {
      type: "geojson",
      data: this.negativeCoronaData
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

  handleCoronaEvent = (event) => {
    if(this.state.isCronaStreamToggled) {
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
};
  
export default HeatMap;
