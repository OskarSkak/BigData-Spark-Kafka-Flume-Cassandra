import './App.css';
import NavBar from './Components/NavBar';
import Map from './Components/Mapbox';
import { useState } from 'react';
import WebsocketManager from './Components/WebsocketManager';

function App() {

  const [states, setStates] = useState('clear');
  const [tweet, setTweet] = useState('');

  return (
    <div className="App">
      <NavBar setStates={setStates}/>
      <Map states={states} tweets={tweet}/>
      <WebsocketManager setTweet={setTweet}/>
    </div>
  );
}

export default App;
