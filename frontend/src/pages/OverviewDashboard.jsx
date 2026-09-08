import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ScadaDashboardLayout from '../components/ScadaDashboardLayout';

export default function OverviewDashboard({ onNavigate }) {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    async function loadStations() {
      try {
        const stRes = await api.getStations();
        setStations(stRes.data);
      } catch (err) {
        console.error("Error loading stations for SCADA dashboard:", err);
      }
    }
    loadStations();
  }, []);

  return (
    <ScadaDashboardLayout stations={stations} activeTab="overview" setActiveTab={onNavigate} />
  );
}
