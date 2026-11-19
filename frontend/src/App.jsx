import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LiveMapPage from './pages/LiveMapPage';
import AdminConsole from './pages/AdminConsole';
import DataManagement from './pages/DataManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import OptimizationPage from './pages/OptimizationPage';
import PublicPortal from './pages/PublicPortal';
import GovernanceDocs from './pages/GovernanceDocs';
import AuthModal from './components/AuthModal';

function MainAppContent() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'map' | 'stations' | 'analytics' | 'optimization' | 'incidents' | 'docs' | 'admin'
  const [stations, setStations] = useState([]);

  const loadStations = async () => {
    try {
      const res = await api.getStations();
      setStations(res.data);
    } catch (err) {
      console.error('Error fetching stations:', err);
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage stations={stations} onNavigateToConsole={handleNavigate} />;
      case 'map':
        return <LiveMapPage stations={stations} />;
      case 'stations':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <DataManagement />
          </div>
        );
      case 'analytics':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <AnalyticsPage />
          </div>
        );
      case 'optimization':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <OptimizationPage />
          </div>
        );
      case 'incidents':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <PublicPortal />
          </div>
        );
      case 'docs':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <GovernanceDocs />
          </div>
        );
      case 'admin':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            <AdminConsole stations={stations} onRefreshStations={loadStations} />
          </div>
        );
      default:
        return <LandingPage stations={stations} onNavigateToConsole={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans">
      {/* Universal Auth Modal */}
      <AuthModal />

      {/* Global Persistent Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        stationsCount={stations.length || 130}
      />

      {/* Main Active Page Content */}
      <main className="flex-1 flex flex-col">
        {renderActivePage()}
      </main>

      {/* Global Persistent Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
