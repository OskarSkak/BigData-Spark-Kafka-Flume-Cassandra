import React, { useRef, useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';
import usStates from '../us-states.json'
import "./component.css"

import methods from "./methods";
import paints from './paints';

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';
const HeatMap = (props) =>  {
    const mapContainerRef = useRef(null);
    const [mapContainer, setMapContainer] = useState();
    const [covidData, setCovidData] = useState();
    //setCovidData(methods.fetchCovidDate());
    console.log(props)

    useEffect(() => {
          const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [-98.93, 39.79],
          zoom: [3.5],
        });
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
       /* map.addSource('electionColor', {
          type:'geojson',
          data: usStates
        });
        /*map.addLayer('electionMap',{
          id:'colors',
          type:'fill',
          source: 'electionColor',
          paint: paints.electionPaint
        });*/
        return () => map.remove();
      }, []);
     
      return (
        <div className="map-container" ref={mapContainerRef} />
            
      );
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