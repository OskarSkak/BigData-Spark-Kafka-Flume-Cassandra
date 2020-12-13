import paints from "./paints";

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
                    100000,
                    20,
                    200000,
                    25,
                    300000,
                    30,
                    400000,
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

export {
    renderCovidLayers
}