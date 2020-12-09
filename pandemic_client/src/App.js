import './App.css';
import NavBar from './Components/NavBar';
import HeatMap from './Components/HeatMap';
import Map from './Components/Mapbox';
import { useState } from 'react';

function App() {

  const [states, setStates] = useState('clear');

  return (
    <div className="App">
      <NavBar setStates={setStates}/>
      <Map states={states}/>
    </div>
  );
}

export default App;
