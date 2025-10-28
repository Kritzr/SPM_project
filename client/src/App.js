// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MeetingProvider } from './context/MeetingContext';
import Landing from './components/Landing/Landing';
import Room from './components/Room/Room';
import './App.css';

function App() {
  return (
    <MeetingProvider>
      <Router>
        <div className="App min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </div>
      </Router>
    </MeetingProvider>
  );
}

export default App;
