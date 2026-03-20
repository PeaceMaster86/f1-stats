# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in a new terminal)
cd client
npm install
```

### Step 2: Start the Servers

```bash
# Terminal 1 - Backend (runs on port 5000)
cd server
npm start

# Terminal 2 - Frontend (runs on port 3000)
cd client
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`.

## What You'll See

### Home Page
Overview of all available features with quick navigation.

### Driver Standings
Current championship standings with driver rankings and points.

### Constructor Standings
Team championship performance and statistics.

### Race Results
Detailed results from individual races with finishing positions.

### Race Calendar
Complete season schedule with race dates and circuits.

### Driver Profiles
Individual driver information and career details.

### Lap Times
Lap-by-lap performance analysis from races.

## Features to Try

1. **Select Different Years**: Use the year selector to view historical data
2. **Search Drivers**: Find specific drivers by name in the Profiles section
3. **View Race Details**: Click on races to see detailed results
4. **Navigate Smoothly**: All pages are linked and update in real-time

## Troubleshooting

**Frontend won't load?**
- Make sure backend is running (`http://localhost:5000/api/health`)
- Check that port 3000 is available
- Try `npm install` again

**No data showing?**
- Check your internet connection
- Wait a moment for data to load
- Check browser console for errors (F12)

**Port already in use?**
- Backend: `PORT=5001 npm start`
- Frontend: Update proxy in `client/package.json`

## Next Steps

- Customize colors and styling in CSS files
- Add more features and components
- Connect to a database for saved preferences
- Deploy to a hosting service (Vercel, Heroku, etc.)

## Learn More

- [Check the main README](../README.md)
- [Ergast API Docs](http://ergast.com/mwapi/)
- [React Documentation](https://react.dev/)
