import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from './context/LanguageContext';
import Destinations from './users/destinations.jsx';
import DestinationDetails from './users/DestinationDetails.jsx';
import Discover from './users/discover.jsx';
import AIPlanner from './users/AIPlanner.jsx';
import GeneratedPlansPage from './users/GeneratedPlansPage.jsx';
import TravelTips from './users/travelTips.jsx';
import Reviews from './users/reviews.jsx';
import UserProfile from './users/UserProfile.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import Login from './users/Login.jsx';
import NotificationPopup from './components/NotificationPopup.jsx';

// Read Google OAuth Client ID directly from Vite env and normalize it
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const GOOGLE_IS_CONFIGURED = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE');

// Dev-time check: warn if not configured
if (!GOOGLE_IS_CONFIGURED) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set or is invalid. Google Sign-In will be disabled.');
}

function App() {
  const appContent = (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Destinations />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/generated-plans" element={<GeneratedPlansPage />} />
          <Route path="/travel-tips" element={<TravelTips />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );

  return GOOGLE_IS_CONFIGURED ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <>
        {appContent}
        <NotificationPopup />
      </>
    </GoogleOAuthProvider>
  ) : (
    <>
      {appContent}
      <NotificationPopup />
    </>
  );
}

export default App
