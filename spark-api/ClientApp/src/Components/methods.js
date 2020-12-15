import States from './us_state_capitals.json';
import usStates from '../us-states.json';
import axios from "axios";

export default{
    fetchCovidData: async () => {
        let respons = await fetch('https://api.covidtracking.com/v1/states/current.json');
        let data = await respons.json();
        let features = [];
        data.forEach(ele => {
            var state = States[ele.state];
            if (state) {
                let feature = {
                    type: "Feature",
                    properties: { state: ele.state, posetive: ele.positive }, geometry: { type: "Point", coordinates: [state.long, state.lat] }
                };
                features.push(feature);
            }
        }
        );
        let covidData = { features: { type: "FeatureCollection", features: features } };
        return covidData;
    },

    fetchHistoricCoronaStream: async (from, to) => {
        let result = await axios.get(`http://localhost:5000/api/historictweets?from=${from}&to=${to}&type=corona`)
        return result.data;
    },

    fetchHistoricNewsStream: async (from, to) => {
        let result = await axios.get(`http://localhost:5000/api/historictweets?from=${from}&to=${to}&type=newscorrelated`);
        return result.data;
    }
}