import States from './us_state_capitals.json';
import usStates from '../us-states.json';

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
        return [
            {
                id: "123123123",
                timestamp_ms: 19283019283,
                coordinates: [[[-106.645646, 25.837092],[-106.645646, 36.500695],[-93.508131, 36.500695],[-93.508131, 25.837092]]],
                screen_name: "Ulrik",
                prediction: "Positive",
                negativeConfidence: 0.49,
                positiveConfidence: 0.51,
                text: "Morten er awesome"
            },
            {
                id: "321321321",
                timestamp_ms: 239287392837,
                coordinates: [[[-116.645646, 35.837092],[-106.645646, 36.500695],[-93.508131, 36.500695],[-93.508131, 25.837092]]],
                screen_name: "Morten",
                prediction: "Negative",
                negativeConfidence: 0.51,
                positiveConfidence: 0.49,
                text: "Ulrik er den bedste"
            }
        ]
    },

    fetchHistoricNewsStream: async (from, to) => {
        return [
            {
                id: "123123123",
                timestamp_ms: 19283019283,
                coordinates: [[[-106.645646, 25.837092],[-106.645646, 36.500695],[-93.508131, 36.500695],[-93.508131, 25.837092]]],
                screen_name: "Ulrik",
                prediction: "Positive",
                negativeConfidence: 0.49,
                positiveConfidence: 0.51,
                text: "Morten er awesome"
            },
            {
                id: "321321321",
                timestamp_ms: 239287392837,
                coordinates: [[[-116.645646, 25.837092],[-106.645646, 36.500695],[-93.508131, 36.500695],[-93.508131, 25.837092]]],
                screen_name: "Morten",
                prediction: "Negative",
                negativeConfidence: 0.51,
                positiveConfidence: 0.49,
                text: "Ulrik er den bedste"
            }
        ]
    }
}