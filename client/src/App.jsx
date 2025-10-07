import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import HomePage from './Pages/HomePage/HomePage'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;