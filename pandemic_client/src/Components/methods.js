import States from './us_state_capitals.json';
import usStates from '../us-states.json';

export default{
    fetchCovidDate: async () => {
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
    }
}