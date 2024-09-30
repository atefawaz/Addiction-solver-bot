import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; 
import Login from './components/Login';
import Signup from './components/Signup'; 
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute'; 
import PricingComponent from './components/PricingComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/PricingComponent" element={<PricingComponent />} />
        
        
        {/* Protected route for Chatbot */}
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
