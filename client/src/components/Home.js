import React from 'react';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to F1 Statistics</h1>
        <p>Your ultimate source for Formula 1 race data and analytics</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">👨‍🏫</div>
          <h3>Driver Standings</h3>
          <p>Track the championship standings for all drivers competing in Formula 1</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏢</div>
          <h3>Constructor Standings</h3>
          <p>View the team championship points and performance metrics</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏁</div>
          <h3>Race Results</h3>
          <p>Explore detailed results from every race including positions and points</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Race Calendar</h3>
          <p>See the complete schedule for the current F1 season</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏎️</div>
          <h3>Driver Profiles</h3>
          <p>Discover detailed information about each driver on the grid</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Lap Times</h3>
          <p>Analyze lap times and performance data from individual races</p>
        </div>
      </div>

      <div className="info-section">
        <h2>About F1 Statistics</h2>
        <p>
          This website provides comprehensive Formula 1 statistics and data visualization.
          Data is sourced from the Ergast Developer API, which maintains a historical database
          of Formula 1 racing data since 1950.
        </p>
        <p>
          Whether you're a casual fan or a dedicated enthusiast, explore the various sections
          to analyze driver performance, team statistics, race results, and much more.
        </p>
      </div>
    </div>
  );
}
