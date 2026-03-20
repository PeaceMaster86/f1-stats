import React, { useState, useEffect } from 'react';
import './RaceResults.css';

export default function RaceResults() {
  const [races, setRaces] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedRace, setSelectedRace] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/races/${year}`);
        if (!response.ok) throw new Error('Failed to fetch races');
        const data = await response.json();
        setRaces(data.RaceTable.Races || []);
        setSelectedRace(null);
        setResults([]);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [year]);

  const handleRaceSelect = async (race) => {
    setSelectedRace(race);
    try {
      const response = await fetch(`/api/races/${year}/${race.round}/`);
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      setResults(data.RaceTable.Races[0]?.Results || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    }
  };

  return (
    <div className="race-results">
      <h1>🏁 Race Results</h1>

      <div className="controls">
        <label htmlFor="year-select">Select Year: </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="results-container">
        <div className="races-list">
          <h3>Races ({races.length})</h3>
          {loading && <div className="loading">Loading races...</div>}
          {!loading && races.length === 0 && <div className="no-data">No races found</div>}
          {!loading && races.map((race) => (
            <div
              key={race.round}
              className={`race-item ${selectedRace?.round === race.round ? 'active' : ''}`}
              onClick={() => handleRaceSelect(race)}
            >
              <div className="race-number">R{race.round}</div>
              <div className="race-info">
                <div className="race-name">{race.name}</div>
                <div className="race-date">{new Date(race.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="results-detail">
          {selectedRace ? (
            <>
              <h3>{selectedRace.name} - {selectedRace.date}</h3>
              <div className="circuit-info">
                <strong>{selectedRace.Circuit.circuitName}</strong>
                <span>{selectedRace.Circuit.Location.locality}, {selectedRace.Circuit.Location.country}</span>
              </div>

              {results.length > 0 ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Status</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, idx) => (
                        <tr key={idx}>
                          <td className="position">{result.position}</td>
                          <td className="driver-name">
                            {result.Driver.givenName} {result.Driver.familyName}
                          </td>
                          <td>{result.Constructor.name}</td>
                          <td>{result.status}</td>
                          <td className="points">{result.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">No results available</div>
              )}
            </>
          ) : (
            <div className="no-selection">Select a race to view results</div>
          )}
        </div>
      </div>
    </div>
  );
}
