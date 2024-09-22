import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './images/MRT-Planner-SG-Logo.png';
import mrtMap from './images/mrt-map.jpg';
import './App.css';

function App() {
  //use state for storing stations data, start station, end station and results
  const [stations, setStations] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [results, setResults] = useState(null);

  //fetch stations data when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/stations')
      .then(response => setStations(response.data))
      .catch(error => console.error('Error fetching stations:', error));
  }, []);

  //handle form submission to obtain routes
  const handleSubmit = () => {
    if (startStation === endStation) { //cannot have same start and end stations
      setResults({ error: "Boarding and alighting stations must be different!" });
    } else {
      //remove station codes from name
      const start = startStation.slice(0, startStation.indexOf('[')-1)
      const end = endStation.slice(0, endStation.indexOf('[')-1)
      axios.post('http://localhost:5000/api/solve', { start, end })
        .then(response => setResults(response.data))
        .catch(error => console.error('Error submitting request:', error));
    }
    
  };

  //handle reset
  const handleReset = () => {
    window.location.reload(); //refresh page
  };

  return (
    <div className="App">
      {/* Top row with logo and table */}
      <div className="top-row">
        <div className="top-row-content">
          <img src={logo} alt="MRT Planner SG Logo" className="logo" />
          <div className="station-form">
            <table>
              <tbody>
                <tr>
                  <td>Boarding Station</td>
                  <td>Alighting Station</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <select
                      value={startStation}
                      onChange={(e) => setStartStation(e.target.value)}
                    >
                      <option value="">Select</option>
                      {stations.map((station) => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={endStation}
                      onChange={(e) => setEndStation(e.target.value)}
                    >
                      <option value="">Select</option>
                      {stations.map((station) => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleReset}>Reset</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Second row with MRT map */}
      <div className="second-row">
        <img src={mrtMap} alt="MRT Map" className="mrt-map" width = "750" height = "750"/>
        <div className="paragraph">
          <p>This is a personal project.</p>
        </div>
      </div>

      {/* Third row with dynamic results */}
      <div className="third-row">
        {results ? (
          results.error ? (
            <div className="error-message">
              <p>{results.error}</p>
            </div>
          ) : (
            <div className="results">
              <h3>Possible Routes</h3>
              <ul>
                {results.map((result, index) => (
                  <li key={index}>
                    <div className="route-item">
                      <div className="path-info">
                        <h4>Route {index + 1}</h4>
                        <p><strong>Path Codes:</strong> {result.path.codes.join(' -> ')}</p>
                        <p><strong>Path Stations:</strong> {result.path.names.join(' -> ')}</p>
                        <p><strong>Transfer Stations:</strong> {result.path.transfer.join(', ')}</p>
                        <p><strong>Total Time:</strong> {result.path.time} minutes</p>
                      </div>
                      <div className="timing-info">
                        {/* <h4>Timing Information</h4> */}
                        <p><strong>Latest Time to Leave:</strong> {result.timings.lastTrain.finalLeaveTime}</p>
                        <p><strong>Estimated Time of Arrival:</strong> {result.timings.lastTrain.finalETA}</p>
                        {/* <p><strong>Leave Times:</strong> {result.timings.lastTrain.leaveTime.join(', ')}</p> */}
                        {/* <p><strong>Train Termination:</strong> {result.timings.lastTrain.terminate.join(' -> ')}</p> */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        ) : (
          <p>Please submit your stations to see possible routes.</p>
        )}
      </div>
    </div>
  );
}

export default App;
