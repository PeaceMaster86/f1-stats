import React, { useState, useEffect } from 'react';
import './RaceCalendar.css';

export default function RaceCalendar() {
  const [races, setRaces] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/calendar/${year}`);
        if (!response.ok) throw new Error('Failed to fetch calendar');
        const data = await response.json();
        setRaces(data.RaceTable.Races || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [year]);

  const isRaceScheduled = (date) => {
    const now = new Date();
    return new Date(date) > now;
  };

  const isRaceCompleted = (date) => {
    const now = new Date();
    return new Date(date) <= now;
  };

  return (
    <div className="race-calendar">
      <h1>📅 F1 Season Calendar</h1>

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
      {loading && <div className="loading">Loading calendar...</div>}

      {!loading && !error && races.length > 0 && (
        <div className="calendar-grid">
          {races.map((race, idx) => {
            const raceDate = new Date(race.date);
            const scheduled = isRaceScheduled(race.date);
            const completed = isRaceCompleted(race.date);

            return (
              <div
                key={idx}
                className={`race-card ${completed ? 'completed' : scheduled ? 'scheduled' : 'upcoming'}`}
              >
                <div className="race-header">
                  <span className="race-round">Round {race.round}</span>
                  <span className="race-status">
                    {completed ? '✓ Completed' : scheduled ? '🔜 Upcoming' : '⏳ Scheduled'}
                  </span>
                </div>

                <h3>{race.name}</h3>

                <div className="race-details">
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">{raceDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Circuit</span>
                    <span className="value">{race.Circuit.circuitName}</span>
                  </div>

                  <div className="detail-item">
                    <span className="label">Location</span>
                    <span className="value">
                      {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                    </span>
                  </div>
                </div>

                <div className="race-footer">
                  <a href={race.url} target="_blank" rel="noopener noreferrer" className="race-link">
                    More Info →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && races.length === 0 && (
        <div className="no-data">No races found for this year</div>
      )}
    </div>
  );
}
