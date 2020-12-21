import paints from "./paints";
import mapboxgl from "mapbox-gl"

const renderCovidLayers = (map, source) => {

    map.addLayer({
        id: 'CovidUnclusteredLayer',
        type: 'circle',
        source: source,
        layout: {visibility: "visible"},
        paint: {
            'circle-color': '#fa5757',
                'circle-radius': [
                'step',
                    ['get', 'posetive'],
                    15,
                    2000,
                    20,
                    5000,
                    25,
                    8000,
                    30,
                    12000,
                    35
                ]
            }
    });

    map.addLayer({
        id: 'CovidCountLayer',
        type: 'symbol',
        source: source,
        layout: {
            'text-field': '{posetive}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        },
        paint: {
            "text-color": "white"
        }
    });
}

const renderStateLayers = (map, source) => {
    map?.addLayer({
        'id': 'StateSourceLayer',
        'type': 'fill',
        'source': source,
        'layout': {},
        'paint': paints.electionPaint
      })
      map?.addLayer({
        "id": "StateSourceLineLayer",
        "type": "line", 
        "source": source,
        "layout": {},
        "paint": paints.linePaint
      })
}

const renderNegativeCoronaHeatmap = (map, source) => {
    map?.addLayer(
    {
        'id': 'NegativeCorona-heat',
        'type': 'heatmap',
        'source': source,
        'maxzoom': 9,
        'paint': {
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
                0, 'rgba(236,222,239,0)',
                0.2, 'rgb(208,209,230)',
                0.4, 'rgb(166,189,219)',
                0.6, 'rgb(103,169,207)',
                0.8, 'rgb(28,144,153)'
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
    });
            
    map?.addLayer(
    {
        'id': 'NegativeCorona-point',
        'type': 'circle',
        'source': source,
        'minzoom': 7,
        'paint': {
            // Size circle radius by earthquake magnitude and zoom level
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
            'circle-color': "green",
            'circle-stroke-color': 'black',
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
        }
    });
}

const renderPositiveCoronaHeatmap = (map, source) => {
    map?.addLayer(
        {
            'id': 'PositiveCoronaHeatmap-heat',
            'type': 'heatmap',
            'source': source,
            'maxzoom': 9,
            'paint': {
                // Increase the heatmap weight based on frequency and property magnitude
                /*'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    0,
                    0,
                    6,
                    1
                ],*/
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
                    0,"rgba(0, 0, 255, 0)",
                    0.1,"#ffffb2",
                    0.3,"#feb24c",
                    0.5,"#fd8d3c",
                    0.7,"#fc4e2a",
                    1,"#e31a1c"
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
        });
                
        map?.addLayer(
        {
            'id': 'PositiveCoronaHeatmap-point',
            'type': 'circle',
            'source': source,
            'minzoom': 7,
            'paint': {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    10,
                    16,
                    10
                ],
                // Color circle by earthquake magnitude
                'circle-color': "red",
                'circle-stroke-color': 'black',
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
            }
    });
}
const renderPositiveNewsHeatmap = (map, source) => {
    map?.addLayer(
        {
            'id': 'PositiveNews-heat',
            'type': 'heatmap',
            'source': source,
            'maxzoom': 9,
            'paint': {
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
                    0, 'rgba(197, 252, 197,0)',
                    0.1,"#9AF59A",
                    0.3,"#8DE08D",
                    0.5,"#78FF78",
                    0.7,"#4CFC4C",
                    1,"#00D400"
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
        });
                
        map?.addLayer(
        {
            'id': 'PositiveNews-point',
            'type': 'circle',
            'source': source,
            'minzoom': 7,
            'paint': {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    10,
                    16,
                    10
                ],
                // Color circle by earthquake magnitude
                'circle-color': "Green",
                'circle-stroke-color': 'blue',
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
            }
    });
}
const renderNegativeNewsHeatmap = (map, source) => {
    map?.addLayer(
        {
            'id': 'NegativeNews-heat',
            'type': 'heatmap',
            'source': source,
            'maxzoom': 9,
            'paint': {
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
                    0,"rgba(186, 143, 255,0)",
                    0.1,"#9568DE",
                    0.3,"#7350AB",
                    0.5,"#6B41B0",
                    0.7,"#5922B3",
                    1,"#4200AD"
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
        });
                
        map?.addLayer(
        {
            'id': 'NegativeNews-point',
            'type': 'circle',
            'source': source,
            'minzoom': 7,
            'paint': {
                // Size circle radius by earthquake magnitude and zoom level
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    10,
                    16,
                    10
                ],
                // Color circle by earthquake magnitude
                'circle-color': "purple",
                'circle-stroke-color': 'yellow',
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
            }
    });
}

export {
    renderCovidLayers,
    renderStateLayers,
    renderNegativeCoronaHeatmap,
    renderPositiveCoronaHeatmap,
    renderNegativeNewsHeatmap,
    renderPositiveNewsHeatmap
}