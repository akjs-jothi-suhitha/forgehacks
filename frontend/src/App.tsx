import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { TopicSetupPage } from './pages/TopicSetupPage';
import { LearningSessionPage } from './pages/LearningSessionPage';
import { ConceptExplorerPage } from './pages/ConceptExplorerPage';
import { ApplicationLabPage } from './pages/ApplicationLabPage';
import { ProgressPage } from './pages/ProgressPage';
import { SessionSummaryPage } from './pages/SessionSummaryPage';
import { fetchHealth } from './services/api';

export function App() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchHealth()
      .then(data => {
        setIsDemo(Boolean(data.demo_mode));
      })
      .catch(() => setIsDemo(true));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100 selection:bg-indigo-500 selection:text-white">
        <Navbar isDemo={isDemo} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/learn" element={<TopicSetupPage />} />
            <Route path="/session/:id" element={<LearningSessionPage />} />
            <Route path="/concepts" element={<ConceptExplorerPage />} />
            <Route path="/application" element={<ApplicationLabPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/summary/:id" element={<SessionSummaryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
