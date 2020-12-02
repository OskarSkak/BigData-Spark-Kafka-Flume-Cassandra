import React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = 'pk.eyJ1IjoidWxyaWtzYW5kYmVyZyIsImEiOiJja2ZwYXlsdDkwM2tuMzVycHpyeXFjanc0In0.iq4edTiobCrtZBUrd_9T2g';

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            map: null,
            lng: -98.93,
            lat: 39.79,
            zoom: 3.5
        }
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        map.on("click", this.onClickHandler)

        this.setState({map: map})
        this.fetchData();
    }

    fetchData = async () => {
        let respons = await fetch('https://corona.lmao.ninja/v2/countries')
        let data = await respons.json()
        for(let i = 0; i < data.length; i++) {
            var point = data[i];

            var marker = new mapboxgl.Marker()
            .setLngLat([point.countryInfo.long, point.countryInfo.lat])
            .addTo(this.state.map)

        }

        console.log(data)
    }


    onClickHandler = (event) => {
        console.log(event.lngLat)

        var marker = new mapboxgl.Marker()
            .setLngLat([event.lngLat.lng, event.lngLat.lat])
            .addTo(this.state.map)
    }





    render = () => {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <div ref={el => this.mapContainer = el} style={{width: "100%", height: "100%"}} />
            </div>
        )

    }
}

export default Map;