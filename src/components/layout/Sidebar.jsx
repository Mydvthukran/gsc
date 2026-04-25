import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, LineChart, Map, Package, Bell, Globe, ChevronLeft, ChevronRight, Zap, X } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/forecast', label: 'Demand Forecast', Icon: LineChart },
  { path: '/routes', label: 'Route Optimizer', Icon: Map },
  { path: '/inventory', label: 'Inventory', Icon: Package },
  { path: '/alerts', label: 'Alerts', Icon: Bell },
  { path: '/impact', label: 'Impact & SDGs', Icon: Globe },
];

export default function Sidebar({ isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-mark font-serif">WGB</div>
          {(!collapsed || isOpen) && <span className="logo-text font-serif">OptiChain<span className="dot">.</span></span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {isOpen && (
          <button className="mobile-close" onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon"><item.Icon size={20} /></span>
              {(!collapsed || isOpen) && <span className="nav-label">{item.label}</span>}
              {(!collapsed || isOpen) && isActive && <span className="nav-indicator" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {(!collapsed || isOpen) && (
          <div className="sdg-badge">
            <div className="sdg-icons flex-center gap-sm">
              <Globe size={14} /> SDG 12 & 13
            </div>
            <div className="sdg-text">Reducing waste & emissions</div>
          </div>
        )}
      </div>
    </aside>
  );
}
