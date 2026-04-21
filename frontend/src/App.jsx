import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Destinations from './users/destinations.jsx';
import Discover from './users/discover.jsx';
import AIPlanner from './users/AIPlanner.jsx';
import TravelTips from './users/travelTips.jsx';
import Reviews from './users/reviews.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Destinations />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/travel-tips" element={<TravelTips />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}



export default App
