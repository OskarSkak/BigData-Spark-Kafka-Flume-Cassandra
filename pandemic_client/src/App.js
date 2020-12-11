import './App.css';
import NavBar from './Components/NavBar';
import HeatMap from './Components/HeatMap';
import Map from './Components/Mapbox';
import { useState } from 'react';
import WebsocketManager from './Components/WebsocketManager';

function App() {

  const [states, setStates] = useState('clear');

  return (
    <div className="App">
      <NavBar setStates={setStates}/>
      <Map states={states}/>
      <WebsocketManager></WebsocketManager>
    </div>
  );
}

export default App;
