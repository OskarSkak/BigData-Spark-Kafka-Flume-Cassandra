import './App.css';
import NavBar from './Components/NavBar';
import HeatMap from './Components/HeatMap';
import Map from './Components/Mapbox';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Map></Map>
    </div>
  );
}

export default App;
