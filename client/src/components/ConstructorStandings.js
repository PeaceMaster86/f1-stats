import React, { useState, useEffect } from 'react';
import './StandingsPage.css';

export default function ConstructorStandings() {
  const [standings, setStandings] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/constructors/${year}`);
        if (!response.ok) throw new Error('Failed to fetch standings');
        const data = await response.json();
        const standingsTable = data.StandingsTable.StandingsList[0];
        setStandings(standingsTable?.ConstructorStandings || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [year]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div className="standings-page">
      <h1>🏢 Constructor Standings</h1>

      <div className="controls">
        <label htmlFor="year-select">Select Year: </label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          {Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {loading && <div className="loading">Loading standings...</div>}

      {!loading && !error && standings.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Constructor</th>
                <th>Nationality</th>
                <th>Points</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((entry, idx) => (
                <tr key={idx} className={idx < 5 ? 'top-10' : ''}>
                  <td className="position">{entry.position}</td>
                  <td className="driver-name">{entry.Constructor.name}</td>
                  <td>{entry.Constructor.nationality}</td>
                  <td className="points">{entry.points}</td>
                  <td>{entry.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && standings.length === 0 && (
        <div className="no-data">No standings data available</div>
      )}
    </div>
  );
}
