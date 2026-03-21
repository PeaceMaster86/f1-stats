const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
// Using OpenF1 API as alternative to Ergast
const OPENF1_API = 'https://api.openf1.org/v1';

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
    const response = await axios.get(`${OPENF1_API}/standings`, {
      params: { year },
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`No standings data available for ${year} in OpenF1`);
      res.json([]);
    } else {
      console.error('Error fetching driver standings:', error.message);
      res.status(500).json({ error: 'Failed to fetch standings' });
    }
  }
});

// Get constructor standings
app.get('/api/constructors/:year?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const response = await axios.get(`${OPENF1_API}/constructors`, {
      params: { year },
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      // OpenF1 may not have constructors endpoint for all years
      console.log(`No constructor data available for ${year} in OpenF1`);
      res.json([]);
    } else {
      console.error('Error fetching constructor standings:', error.message);
      res.status(500).json({ error: 'Failed to fetch constructor standings' });
    }
  }
});

// Get race results for a specific race
app.get('/api/races/:year/:round?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const round = req.params.round;
    
    const params = { year };
    if (round) params.round = round;
    
    const response = await axios.get(`${OPENF1_API}/sessions`, {
      params,
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`No race data available for ${req.params.year}/${req.params.round}`);
      res.json([]);
    } else {
      console.error('Error fetching race results:', error.message);
      res.status(500).json({ error: 'Failed to fetch race results' });
    }
  }
});

// Get race calendar
app.get('/api/calendar/:year?', async (req, res) => {
  try {
    const year = req.params.year || new Date().getFullYear();
    const response = await axios.get(`${OPENF1_API}/sessions`, {
      params: { year, session_type: 'Race' },
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`No calendar data available for ${year}`);
      res.json([]);
    } else {
      console.error('Error fetching calendar:', error.message);
      res.status(500).json({ error: 'Failed to fetch calendar' });
    }
  }
});

// Get lap times for a specific race
app.get('/api/laps/:year/:round', async (req, res) => {
  try {
    const { year, round } = req.params;
    const response = await axios.get(`${OPENF1_API}/laps`, {
      params: { year, round },
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching lap times:', error);
    res.status(500).json({ error: 'Failed to fetch lap times' });
  }
});

// Get driver profile
app.get('/api/driver/:driverId/:year?', async (req, res) => {
  try {
    const params = { driver_number: req.params.driverId };
    if (req.params.year) {
      params.year = req.params.year;
    }
    
    const response = await axios.get(`${OPENF1_API}/drivers`, {
      params,
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching driver profile:', error);
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});

// Get all drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const response = await axios.get(`${OPENF1_API}/drivers`, {
      headers: {
        'User-Agent': 'F1 Statistics App/1.0'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

app.listen(PORT, () => {
  console.log(`F1 Statistics API server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/api/health to check status`);
});
