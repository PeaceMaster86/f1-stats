import React, { useState, useEffect } from 'react';
import './DriverProfiles.css';

export default function DriverProfiles() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/drivers');
        if (!response.ok) throw new Error('Failed to fetch drivers');
        const data = await response.json();
        setDrivers(data.DriverTable.Drivers || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver =>
    `${driver.givenName} ${driver.familyName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="driver-profiles">
      <h1>🏎️ Driver Profiles</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {loading && <div className="loading">Loading drivers...</div>}

      {!loading && !error && (
        <div className="drivers-container">
          <div className="drivers-grid">
            {filteredDrivers.map((driver, idx) => (
              <div
                key={idx}
                className={`driver-card ${selectedDriver?.driverId === driver.driverId ? 'active' : ''}`}
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="driver-number">{driver.permanentNumber || 'TBA'}</div>
                <div className="driver-name">
                  {driver.givenName} {driver.familyName}
                </div>
                <div className="driver-meta">
                  <span>{driver.nationality}</span>
                  <span>DOB: {new Date(driver.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedDriver && (
            <div className="driver-detail">
              <h2>{selectedDriver.givenName} {selectedDriver.familyName}</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Number</label>
                  <value>{selectedDriver.permanentNumber || 'Not Assigned'}</value>
                </div>
                <div className="detail-item">
                  <label>Nationality</label>
                  <value>{selectedDriver.nationality}</value>
                </div>
                <div className="detail-item">
                  <label>Date of Birth</label>
                  <value>{new Date(selectedDriver.dateOfBirth).toLocaleDateString()}</value>
                </div>
                <div className="detail-item">
                  <label>Driver ID</label>
                  <value>{selectedDriver.driverId}</value>
                </div>
              </div>
              <a href={selectedDriver.url} target="_blank" rel="noopener noreferrer" className="external-link">
                View on Wikipedia →
              </a>
            </div>
          )}

          {!selectedDriver && (
            <div className="no-selection">Select a driver to view details</div>
          )}
        </div>
      )}

      {!loading && !error && filteredDrivers.length === 0 && searchTerm && (
        <div className="no-data">No drivers found matching "{searchTerm}"</div>
      )}
    </div>
  );
}
