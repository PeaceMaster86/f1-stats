# F1 Race Statistics Website

A full-stack web application for viewing and analyzing Formula 1 race statistics, driver standings, constructor standings, race results, and more.

## 🎯 Features

- **Driver Standings**: View current and historical driver championship standings
- **Constructor Standings**: Track team championship performance
- **Race Results**: Detailed results from individual races including finishing positions and points
- **Race Calendar**: Complete season schedule with race dates and circuits
- **Driver Profiles**: Comprehensive driver information and statistics
- **Lap Times**: Analyze lap-by-lap performance data from races

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express.js
- **API**: RESTful API that proxies data from Ergast F1 API
- **Port**: 5000 (default)

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: CSS3 with responsive design
- **Port**: 3000 (default, via Create React App)

## 📋 Project Structure

```
f1/
├── server/                           # Backend server
│   ├── package.json
│   ├── server.js                    # Express server with API endpoints
│   └── .env                         # Environment variables (create this)
│
├── client/                          # React frontend
│   ├── package.json
│   ├── public/
│   │   └── index.html              # Main HTML file
│   ├── src/
│   │   ├── App.js                  # Main App component
│   │   ├── App.css                 # App styles
│   │   ├── index.js                # React entry point
│   │   ├── index.css               # Global styles
│   │   └── components/
│   │       ├── Home.js             # Home page
│   │       ├── Home.css
│   │       ├── DriverStandings.js
│   │       ├── ConstructorStandings.js
│   │       ├── StandingsPage.css
│   │       ├── RaceResults.js
│   │       ├── RaceResults.css
│   │       ├── RaceCalendar.js
│   │       ├── RaceCalendar.css
│   │       ├── DriverProfiles.js
│   │       ├── DriverProfiles.css
│   │       ├── LapTimes.js
│   │       └── LapTimes.css
│   └── build/                       # Production build (generated)
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 14.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Option 1: Run both servers in separate terminals**

Terminal 1 (Backend):
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd client
npm start
# Frontend opens automatically at http://localhost:3000
```

**Option 2: Development with auto-reload**

Terminal 1 (Backend):
```bash
cd server
npm run dev
# Uses nodemon for auto-restart on file changes
```

Terminal 2 (Frontend):
```bash
cd client
npm start
# React development server with hot reload
```

### Building for Production

Frontend:
```bash
cd client
npm run build
# Creates optimized production build in client/build/
```

## 📡 API Endpoints

All endpoints return data from the Ergast F1 API.

### Health Check
- `GET /api/health` - Check if API is running

### Standings
- `GET /api/standings/:year` - Driver standings for a season
- `GET /api/constructors/:year` - Constructor standings for a season

### Race Data
- `GET /api/races/:year` - All races in a season
- `GET /api/races/:year/:round` - Specific race results
- `GET /api/calendar/:year` - Season calendar

### Lap Data
- `GET /api/laps/:year/:round` - Lap times for a specific race

### Drivers
- `GET /api/drivers` - All F1 drivers
- `GET /api/driver/:driverId/:year` - Specific driver information

## 🎨 Styling

The application features a modern dark theme with:
- Formula 1 red accent color (#ff1801)
- Dark background and card layouts
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-friendly design

## 📊 Data Source

This application uses the **Ergast Developer API**, a free service that provides:
- Historical F1 data since 1950
- Driver and constructor statistics
- Race results and standings
- Lap times and circuit information

**API Documentation**: [Ergast Developer API](http://ergast.com/mwapi/)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development
```

## 🧪 Development

### Frontend Development
- Hot reload enabled by default
- React DevTools browser extension recommended
- Eslint configuration in `package.json`

### Backend Development
- Uses nodemon for auto-restart during development
- CORS enabled for frontend communication
- Axios for HTTP requests

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚨 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

Backend:
```bash
PORT=5001 npm start
# Update proxy in client/package.json to "http://localhost:5001"
```

### CORS Errors
Ensure the backend is running on port 5000 (or update the proxy in `client/package.json`)

### No Data Displayed
Check that:
1. Backend server is running (`http://localhost:5000/api/health`)
2. Internet connection is active (Ergast API requires external network)
3. Browser console for error messages

## 📝 License

This project is provided as-is for educational purposes.

## 🙏 Credits

- **Data**: [Ergast Developer API](http://ergast.com/mwapi/)
- **Framework**: [React.js](https://react.dev/)
- **Server**: [Express.js](https://expressjs.com/)

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Ergast API Documentation](http://ergast.com/mwapi/)
- [F1 Official Website](https://www.formula1.com/)

---

**Last Updated**: March 2026
