import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import Components and Pages
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AnimatedPage from './components/AnimatedPage';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Profile from './pages/Profile.jsx'; // <-- ADD THIS IMPORT
import History from './pages/History.jsx'; // <-- ADD THIS IMPORT

// A new component to handle the animated routes
function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
        <Route path="/how-it-works" element={<AnimatedPage><HowItWorks /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/signup" element={<AnimatedPage><SignUp /></AnimatedPage>} />
        <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        <Route path="/history" element={<AnimatedPage><History /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </Router>
  );
}

export default App;