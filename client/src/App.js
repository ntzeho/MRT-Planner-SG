import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './images/MRT-Planner-SG-Logo.png';
import mrtMap from './images/mrt-map.jpg';
import './App.css';
import { stationColours, outputPadding } from './constants';

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

  //get the color for a station code
  const getStationColor = (code) => {
    const line = code.slice(0, 2); // Get the first two characters (e.g., 'EW')
    return stationColours[line] || 'black'; // Default to 'black' if no match
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
                        <p><strong>Total Time:</strong> {result.path.time} minutes</p>
                        <p><strong>Latest Time to Leave:</strong> {result.timings.lastTrain.finalLeaveTime}</p>
                        <p><strong>Estimated Time of Arrival:</strong> {result.timings.lastTrain.finalETA}</p>
                        {result.path.transfer && (
                          <p>
                            <strong>Transfer Stations: </strong> 
                            {result.path.transfer.length > 0 
                              ? result.path.transfer.join(', ')
                              : '-'}                             
                          </p>
                        )}
                        {result.path.sections && (
                          <div className="sections-table">
                            <table className="centered-table">
                              <tbody>
                                {Array.from({ length: Math.max(...result.path.sections.map(s => s.length)) }).map((_, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {result.path.sections.map((section, sectionIndex) => (
                                      <td 
                                        key={sectionIndex}
                                        style={{ 
                                          paddingLeft: outputPadding[result.path.sections.length] || '0px' // Dynamically set padding-left
                                        }}
                                      >
                                        {section[rowIndex] ? (
                                          <p>
                                            <span 
                                              style={{ 
                                                backgroundColor: getStationColor(section[rowIndex][0]), // Background color for station code
                                                color: 'white', // Text color to ensure it's readable on colored background
                                                padding: '2px 5px', // Padding for visual clarity
                                                borderRadius: '4px', // Optional: Add rounded corners for better appearance
                                                display: 'inline-block' // Ensure the span behaves like a block with padding
                                              }}>
                                              {section[rowIndex][0]}
                                            </span> 
                                            {' ' + section[rowIndex][1]}
                                          </p>
                                        ) : (
                                          <p></p>
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* {result.path.codes && (
                          <p><strong>Path Codes:</strong> {result.path.codes.join(' -> ')}</p>
                        )}
                        {result.path.names && (
                          <p><strong>Path Stations:</strong> {result.path.names.join(' -> ')}</p>
                        )} */}
                        {result.path.walk && (
                          <p><strong>Walking Path:</strong> {result.path.walk}</p>
                        )}
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
