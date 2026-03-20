import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import DriverStandings from './components/DriverStandings';
import ConstructorStandings from './components/ConstructorStandings';
import RaceResults from './components/RaceResults';
import RaceCalendar from './components/RaceCalendar';
import DriverProfiles from './components/DriverProfiles';
import LapTimes from './components/LapTimes';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('disconnected');
        }
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkApiStatus();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="header-content">
            <h1 className="logo">🏁 F1 Statistics</h1>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/driver-standings">Drivers</Link>
              <Link to="/constructor-standings">Constructors</Link>
              <Link to="/race-results">Results</Link>
              <Link to="/race-calendar">Calendar</Link>
              <Link to="/drivers">Profiles</Link>
              <Link to="/lap-times">Lap Times</Link>
            </nav>
            <div className={`api-status ${apiStatus}`}>
              {apiStatus === 'connected' && '✓ Connected'}
              {apiStatus === 'disconnected' && '✗ Offline'}
              {apiStatus === 'checking' && '⊙ Checking...'}
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/driver-standings" element={<DriverStandings />} />
            <Route path="/constructor-standings" element={<ConstructorStandings />} />
            <Route path="/race-results" element={<RaceResults />} />
            <Route path="/race-calendar" element={<RaceCalendar />} />
            <Route path="/drivers" element={<DriverProfiles />} />
            <Route path="/lap-times" element={<LapTimes />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Data provided by Ergast Developer API • F1 Statistics 2024</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
