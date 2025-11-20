import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIRecommendationsPage from './pages/AIRecommendationsPage.jsx';
import SmartSearchPage from './pages/SmartSearchPage.jsx';
import VirtualTryOnPage from './pages/VirtualTryOnPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AIRecommendationsPage />} />
        <Route path="/search" element={<SmartSearchPage />} />
        <Route path="/try-on" element={<VirtualTryOnPage />} />
        {/* يمكنك إضافة مسارات أخرى هنا */}
      </Routes>
    </Router>
  );
}

export default App;
