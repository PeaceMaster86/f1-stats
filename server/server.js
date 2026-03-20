const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ERGAST_API = 'https://ergast.com/api/f1';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'F1 Statistics API is running' });
});

// Get current year standings
app.get('/api/standings/:year?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const response = await axios.get(`${ERGAST_API}/${year}/driverStandings.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

// Get constructor standings
app.get('/api/constructors/:year?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const response = await axios.get(`${ERGAST_API}/${year}/constructorStandings.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    res.status(500).json({ error: 'Failed to fetch constructor standings' });
  }
});

// Get race results for a specific race
app.get('/api/races/:year/:round?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const round = req.params.round || '';
    const url = round 
      ? `${ERGAST_API}/${year}/${round}/results.json`
      : `${ERGAST_API}/${year}/results.json`;
    
    const response = await axios.get(url);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching race results:', error);
    res.status(500).json({ error: 'Failed to fetch race results' });
  }
});

// Get race calendar
app.get('/api/calendar/:year?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const response = await axios.get(`${ERGAST_API}/${year}.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Get lap times for a specific race
app.get('/api/laps/:year/:round', async (req, res) => {
  try {
    const { year, round } = req.params;
    const response = await axios.get(`${ERGAST_API}/${year}/${round}/laps.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching lap times:', error);
    res.status(500).json({ error: 'Failed to fetch lap times' });
  }
});

// Get driver profile
app.get('/api/driver/:driverId/:year?', async (req, res) => {
  try {
    const year = req.params.year ? `/${req.params.year}` : '';
    const response = await axios.get(`${ERGAST_API}${year}/drivers/${req.params.driverId}.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});

// Get all drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const response = await axios.get(`${ERGAST_API}/drivers.json`);
    res.json(response.data.MRData);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

app.listen(PORT, () => {
  console.log(`F1 Statistics API server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/health to check status`);
});
