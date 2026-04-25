import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Bell, LogOut, User, Menu, X } from 'lucide-react';
import './Header.css';

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'Real-time supply chain overview' },
  '/forecast': { title: 'Demand Forecast', subtitle: 'AI-powered demand predictions' },
  '/routes': { title: 'Route Optimizer', subtitle: 'Smart delivery route planning' },
  '/inventory': { title: 'Inventory', subtitle: 'Stock levels & management' },
  '/alerts': { title: 'Alerts', subtitle: 'Notifications & warnings' },
  '/impact': { title: 'Impact & SDGs', subtitle: 'Sustainability metrics & goals' },
};

export default function Header({ alertCount = 0, user, onLogout, toggleMobileMenu, isMobileMenuOpen }) {
  const location = useLocation();
  const page = pageTitles[location.pathname] || pageTitles['/'];
  const [showMenu, setShowMenu] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="mobile-toggle editorial-card" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="header-page-info">
          <h1 className="header-title font-serif">{page.title}</h1>
          <div className="header-breadcrumb font-sans">
            <span>NETWORK</span>
            <span className="dot">•</span>
            <span>{page.title.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <div className="header-stats-group">
          <div className="header-stat-chip editorial-card date-chip">
            <span className="stat-label">DATE</span>
            <span className="stat-value font-serif">{dateStr.split(',')[1].trim()}</span>
          </div>
          <div className="header-stat-chip editorial-card alert-chip">
            <span className="stat-label">ALERTS</span>
            <span className="stat-value font-serif">{alertCount}</span>
          </div>
        </div>
        
        <div className="header-avatar-wrapper">
          <div className="avatar-trigger editorial-card" onClick={() => setShowMenu(!showMenu)}>
            <div className="avatar-circle">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="avatar-img" />
              ) : (
                <User size={20} />
              )}
            </div>
            <span className="avatar-name font-serif">{user?.displayName?.split(' ')[0] || 'DEMO'}</span>
          </div>

          {showMenu && (
            <div className="avatar-menu editorial-card animate-scaleIn">
              <div className="avatar-menu-header">
                <span className="avatar-menu-name font-serif">{user?.displayName || 'Demo User'}</span>
                <span className="avatar-menu-email">{user?.email || 'demo@optichain.app'}</span>
              </div>
              <div className="avatar-menu-divider" />
              <button className="avatar-menu-item" onClick={onLogout}>
                <LogOut size={16} /> LOGOUT SESSION
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
