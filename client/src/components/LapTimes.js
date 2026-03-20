import React, { useState, useEffect } from 'react';
import './LapTimes.css';

export default function LapTimes() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [lapData, setLapData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
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
        setLapData([]);
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
    setLapData([]);
    try {
      const response = await fetch(`/api/laps/${year}/${race.round}`);
      if (!response.ok) throw new Error('Failed to fetch lap times');
      const data = await response.json();
      setLapData(data.RaceTable.Races[0]?.Laps || []);
    } catch (err) {
      setError(err.message);
      setLapData([]);
    }
  };

  const getFastestLapForDriver = (driverId, laps) => {
    let fastest = null;
    let fastestTime = Infinity;

    laps.forEach(lap => {
      lap.Timings?.forEach(timing => {
        if (timing.driverId === driverId && timing.time) {
          const timeInMs = timeToMs(timing.time);
          if (timeInMs < fastestTime) {
            fastestTime = timeInMs;
            fastest = timing;
          }
        }
      });
    });

    return fastest;
  };

  const timeToMs = (timeStr) => {
    if (!timeStr) return Infinity;
    const parts = timeStr.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60000 + seconds * 1000;
  };

  return (
    <div className="lap-times">
      <h1>⏱️ Lap Times</h1>

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

      <div className="laps-container">
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
                <div className="race-circuit">{race.Circuit.circuitName}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="laps-detail">
          {selectedRace ? (
            <>
              <h3>{selectedRace.name} - Lap Times</h3>
              
              {lapData.length > 0 ? (
                <>
                  <div className="lap-stats">
                    <span>Total Laps: {lapData.length}</span>
                    <span>Drivers: {new Set(lapData.flatMap(l => l.Timings?.map(t => t.driverId))).size}</span>
                  </div>

                  <div className="laps-list">
                    {lapData.slice(0, 20).map((lap, idx) => (
                      <div key={idx} className="lap-card">
                        <div className="lap-number">Lap {lap.number}</div>
                        <table className="lap-table">
                          <tbody>
                            {lap.Timings?.slice(0, 10).map((timing, tidx) => (
                              <tr key={tidx}>
                                <td className="position">{timing.position}</td>
                                <td className="driver">{timing.driverId}</td>
                                <td className="time">{timing.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>

                  {lapData.length > 20 && (
                    <div className="more-laps">
                      Showing 20 of {lapData.length} laps
                    </div>
                  )}
                </>
              ) : (
                <div className="no-data">No lap data available</div>
              )}
            </>
          ) : (
            <div className="no-selection">Select a race to view lap times</div>
          )}
        </div>
      </div>
    </div>
  );
}
