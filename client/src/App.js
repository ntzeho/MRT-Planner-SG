import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './images/MRT-Planner-SG-Logo.png';
import mrtMap from './images/mrt-map.jpg';
import walkPic from './images/walk.svg'
import railPic from './images/rail2.svg'

import './App.css';
import { stationColours } from './constants';

function App() {
  //use states
  const [stations, setStations] = useState([]);
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');

  const [results, setResults] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [expandedRoutes, setExpandedRoutes] = useState({});


  //fetch stations data on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/stations')
      .then(response => setStations(response.data))
      .catch(error => console.error('Error fetching stations:', error));
  }, []);

  //handle form submission to obtain routes
  const handleSubmit = () => {
    if (startStation === endStation) {
      setResults({ error: "Boarding and alighting stations must be different!" });
    } else {
      const start = startStation.slice(0, startStation.indexOf('[') - 1);
      const end = endStation.slice(0, endStation.indexOf('[') - 1);
      axios.post('http://localhost:5000/api/solve', { start, end })
        .then(response => {
          setResults(response.data);
          setExpandedSections(response.data.map(() => false)); //initialize all sections as minimized
        })
        .catch(error => console.error('Error submitting request:', error));
    }
  };

  //reset inputs by refreshing page
  const handleReset = () => {
    window.location.reload();
  };

  //get station color based on stn code
  const getStationColor = (code) => {
    const line = code.slice(0, 2);
    return stationColours[line] || '#f1f1f1'; //default to same background color if no match
  };

  //toggle description expansion
  const toggleSection = (index) => {
    setExpandedSections(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index]; //toggle the specific section
      return newState;
    });
  };

  //toggle route
  const toggleRoute = (routeIndex) => {
    setExpandedRoutes((prev) => ({
      ...prev,
      [routeIndex]: !prev[routeIndex], //toggle the current route's state
    }));
  };


  return (
    <div className="App">
      {/* top row with logo and station form */}
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

        {/* second row with dynamic results */}
        <div className="result-row">
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
                        <p><strong>Total Travelling Time:</strong> {result.path.time} minutes</p>
                        <p><strong>Latest Time to Leave:</strong> {result.timings.lastTrain.finalLeaveTime}</p>
                        <p><strong>Estimated Latest Time of Arrival:</strong> {result.timings.lastTrain.finalETA}</p>

                        {/* route summary graphic as a toggle button */}
                        <button 
                        onClick={() => toggleRoute(index)} 
                        style={{ 
                            border: 'none', 
                            background: 'none', 
                            padding: 0, 
                            cursor: 'pointer', 
                            display: 'inline-block'
                        }}
                        >
                        <div className="route-summary">
                            {result.path.sections.map((section, sectionIndex) => (
                            <React.Fragment key={sectionIndex}>
                                {section[0] === 'Walk' ? (
                                <img src={walkPic} alt="Walk" className="icon" />
                                ) : section[0] === 'Train' ? (
                                <>
                                    <img src={railPic} alt="Train" className="icon" />
                                    <span
                                    style={{
                                        backgroundColor: getStationColor(section[2][0]), // Station code color
                                        color: 'white', //text color
                                        padding: '2px 5px',
                                        borderRadius: '4px',
                                        marginLeft: '5px', //small space before the station code
                                        display: 'inline-block',
                                    }}
                                    >
                                    {section[2][0].slice(0, 2) !==  section[3][0].slice(0, 2)
                                        ? section[3][0].slice(0, 2) //display end station code if condition is met otherwise display start station code
                                        : section[2][0].slice(0, 2)}
                                    </span>
                                </>
                                ) : null}

                                {/* add '>' for transitions between sections */}
                                {sectionIndex < result.path.sections.length - 1 && result.path.sections[sectionIndex + 1][0] !== 'Transfer' && (
                                <span className="transition-arrow"> {'>'} </span>
                                )}
                            </React.Fragment>
                            ))}
                        </div>
                        </button>

                        {/* route summary graphic */}
                        {/* <div className="route-summary">
                            {result.path.sections.map((section, sectionIndex) => (
                            <React.Fragment key={sectionIndex}>
                                {section[0] === 'Walk' ? (
                                <img src={walkPic} alt="Walk" className="icon" />
                                ) : section[0] === 'Train' ? (
                                <>
                                    <img src={railPic} alt="Train" className="icon" />
                                    <span
                                    style={{
                                        backgroundColor: getStationColor(section[2][0]), // Station code color
                                        color: 'white', // Text color
                                        padding: '2px 5px',
                                        borderRadius: '4px',
                                        marginLeft: '5px', // Small space before the station code
                                        display: 'inline-block',
                                    }}
                                    >
                                    {['ST', 'PT'].includes(section[2][0].slice(0, 2)) 
                                        ? section[3][0].slice(0, 2) // Display end station code if condition is met otherwise display start station code
                                        : section[2][0].slice(0, 2)} 
                                    </span>
                                </>
                                ) : null} */}

                                {/* Add '>' for transitions between sections */}
                                {/* {sectionIndex < result.path.sections.length - 1 && result.path.sections[sectionIndex + 1][0] !== 'Transfer' && (
                                <span className="transition-arrow"> {'>'} </span>
                                )}
                            </React.Fragment>
                            ))}
                        </div> */}

                        {/* toggle button for the entire route table */}
                        {/* <button onClick={() => toggleRoute(index)}>
                            {expandedRoutes[index] ? 'Minimize Details' : 'Expand Details'}
                        </button> */}

                        {/* conditionally render the table based on expandedRoutes state */}
                        {expandedRoutes[index] && (
                            <div className="sections-table">
                            <table className="centered-table">
                                <tbody>
                                {result.path.sections.map((section, sectionIndex) => (
                                    <tr key={sectionIndex}>
                                    {/* Start Station (boarding) */}
                                    <td>
                                        <span
                                        style={{
                                            backgroundColor: getStationColor(section[2][0]), // Boarding station code color
                                            color: 'white',
                                            padding: '2px 5px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                        }}
                                        >
                                        {section[2][0]}
                                        </span>
                                        {' ' + section[2][1]} {/* boarding station name */}
                                    </td>

                                    {/* Mode (icon) */}
                                    <td>
                                        {section[0] === 'Walk' ? (
                                        <img src={walkPic} alt="Walk" className="icon" />
                                        ) : section[0] === 'Train' ? (
                                        <img src={railPic} alt="Train" className="icon" />
                                        ) : section[0] === 'Transfer' ? (
                                        // <img src={transferPic} alt="Transfer" className="icon" />
                                        <div className="transfer-icons">
                                            <img src={railPic} alt="Train" className="icon" />
                                            <span className="transfer-arrow"> → </span>
                                            <img src={railPic} alt="Train" className="icon" />
                                        </div>
                                        ) : null}
                                    </td>

                                    {/* Travel Time */}
                                    <td>{section[1]} minutes</td>

                                    {/* End Station (alighting) */}
                                    <td>
                                        <span
                                        style={{
                                            backgroundColor: getStationColor(section[3][0]), // Alighting station code color
                                            color: 'white',
                                            padding: '2px 5px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                        }}
                                        >
                                        {section[3][0]}
                                        </span>
                                        {' ' + section[3][1]} {/* alighting station name */}
                                    </td>

                                    {/* Description */}
                                    <td>
                                        {section[0] === 'Walk' ? (
                                        section[4]
                                        ) : section[0] === 'Transfer' ? (
                                        section[4]
                                        ) : (
                                        <>
                                            {/* toggle button for individual section description */}
                                            <button onClick={() => toggleSection(sectionIndex)}>
                                            {expandedSections[sectionIndex] ? 'Minimize view' : 'View detailed route'}
                                            </button>

                                            {/* conditionally render description */}
                                            {expandedSections[sectionIndex] && (
                                            <ul className="description-list">
                                                {section[4].map((station, stationIndex) => (
                                                <li key={stationIndex}>
                                                    <span
                                                    style={{
                                                        backgroundColor: getStationColor(station[0]),
                                                        color: 'white',
                                                        padding: '2px 5px',
                                                        borderRadius: '4px',
                                                        display: 'inline-block',
                                                    }}
                                                    >
                                                    {station[0]}
                                                    </span>
                                                    {' ' + station[1]}
                                                </li>
                                                ))}
                                            </ul>
                                            )}

                                            {/* {expandedSections[sectionIndex] && (
                                            <div className="description-inline">
                                                {section[4]
                                                .map(
                                                    (station) => (
                                                    <>
                                                        <span
                                                        style={{
                                                            backgroundColor: getStationColor(station[0]), // Station code background color
                                                            color: 'white',
                                                            padding: '2px 5px',
                                                            borderRadius: '4px',
                                                            display: 'inline-block',
                                                            marginRight: '5px', // Add space between stations
                                                        }}
                                                        >
                                                        {station[0]}
                                                        </span>
                                                        {' ' + station[1]}
                                                    </>
                                                    )
                                                )
                                                .reduce((prev, curr) => [prev, ' > ', curr])}
                                            </div>
                                            )} */}
                                        </>
                                        )}
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                          )}
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


      {/* third row with MRT map */}
      <div className="map-row">
        {/* image wrapped in an anchor tag that opens in a new tab */}
        <a href={mrtMap} target="_blank" rel="noopener noreferrer">
          <img src={mrtMap} alt="MRT Map" className="mrt-map" width="750" height="750" />
        </a>
        <div className="project-description-box">
          <h2 className="project-heading">Overview</h2>
          <div className="paragraph">
            <p>
              As its name suggests, MRT Planner SG plans your MRT/LRT journeys for you! Simply enter your boarding and alighting stations, and click the submit button. All feasible routes, including estimated travelling times and the latest times you should be boarding your train at the boarding station, will be displayed. As there are no public real-time data on train arrival times, knowing the latest possible time you should board your train to reach your destination will be useful in planning a late night out with friends/family!
            </p>
            <p className="highlight">- Transfer times at interchanges are always assumed to be 5 minutes.</p>
            <p className="highlight">- Last train timings are scrapped from the SBS and SMRT websites, so they are only as accurate as the websites are. Do reach at least 10 minutes earlier than the stated time to avoid potentially missing your train.</p>
            <p className="highlight">- Last train timings do not account for adjustments in train service hours and are based on the scheduled train departure times. They do, however, account for different timings on weekdays, weekends, and public holidays.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
