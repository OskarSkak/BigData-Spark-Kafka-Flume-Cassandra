import './App.css';
import NavBar from './Components/NavBar';
import Map from './Components/HeatMap';
import { useRef, useState } from 'react';
import WebsocketManager from './Components/WebsocketManager';

function App() {

  const [states, setStates] = useState('clear');
  const [tweet, setTweet] = useState('');
  const myMap = useRef();

  const navClicked = (state) => {

    setStates(state);
    if(states === state) {
      return;
    }

    if(state === "clear") {
      myMap.current?.clearMap();
    }

    if(state === "covid") {
      myMap.current?.fetchCovid();
    }

    console.log(state)
    
  }

  return (
    <div className="App">
      <NavBar setStates={navClicked}/>
      <Map ref={myMap} states={states} tweets={tweet}/>
    </div>
  );
}

export default App;
