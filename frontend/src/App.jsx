import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import InGenControlRoom from './components/InGenControlRoom';
import DataManagement from './pages/DataManagement';
import AnalyticsPage from './pages/AnalyticsPage';
import OptimizationPage from './pages/OptimizationPage';
import PublicPortal from './pages/PublicPortal';
import IntegrationPage from './pages/IntegrationPage';
import GovernanceDocs from './pages/GovernanceDocs';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stations, setStations] = useState([]);

  useEffect(() => {
    async function loadStations() {
      try {
        const res = await api.getStations();
        setStations(res.data);
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    }
    loadStations();
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return null; // Handled directly in InGenControlRoom overview grid
      case 'phase1':
        return <DataManagement />;
      case 'phase2':
        return <AnalyticsPage />;
      case 'phase3':
        return <OptimizationPage />;
      case 'phase4':
        return <PublicPortal />;
      case 'phase5':
        return <IntegrationPage />;
      case 'phase6':
        return <GovernanceDocs />;
      default:
        return null;
    }
  };

  return (
    <InGenControlRoom stations={stations} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActivePage()}
    </InGenControlRoom>
  );
}
