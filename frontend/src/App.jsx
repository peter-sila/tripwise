import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './context/LanguageContext';
import Destinations from './users/destinations.jsx';
import DestinationDetails from './users/DestinationDetails.jsx';
import Discover from './users/discover.jsx';
import AIPlanner from './users/AIPlanner.jsx';
import TravelTips from './users/travelTips.jsx';
import Reviews from './users/reviews.jsx';
import UserProfile from './users/UserProfile.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';

// Replace with your Google OAuth Client ID (from Vite environment variables)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Destinations />} />
            <Route path="/destination/:id" element={<DestinationDetails />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/travel-tips" element={<TravelTips />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<UserProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App
