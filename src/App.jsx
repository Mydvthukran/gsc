import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import useAuth from './hooks/useAuth';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ForecastPage from './pages/ForecastPage';
import RoutesPage from './pages/RoutesPage';
import InventoryPage from './pages/InventoryPage';
import AlertsPage from './pages/AlertsPage';
import ImpactPage from './pages/ImpactPage';
import productCatalog from './data/productCatalog';
import { generateAlerts } from './data/alertRules';

function App() {
  const { user, loading, logout } = useAuth();
  const alerts = useMemo(() => generateAlerts(productCatalog), []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 700, background: '#000', color: '#fff', padding: '6px 14px', display: 'inline-block', marginBottom: '24px', letterSpacing: '0.2em' }}>WGB</div>
          <p className="font-serif" style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>OptiChain Intelligence Loading<span style={{ color: 'var(--accent-primary)' }}>.</span></p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout alertCount={alerts.length} user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
