import { useState, useMemo } from 'react';
import productCatalog from '../data/productCatalog';
import { generateAlerts } from '../data/alertRules';
import IconResolver from '../components/IconResolver';
import { CheckCircle, X } from 'lucide-react';
import './AlertsPage.css';

export default function AlertsPage() {
  const allAlerts = useMemo(() => generateAlerts(productCatalog), []);
  const [alerts, setAlerts] = useState(allAlerts);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter);
  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  const dismiss = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.round((now - d) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.round(diff / 60)}h ago`;
    return `${Math.round(diff / 1440)}d ago`;
  };

  return (
    <div className="alerts-page">
      {/* Filter Bar */}
      <div className="alerts-filter editorial-card animate-fadeIn">
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All', color: 'var(--text-primary)' },
            { key: 'critical', label: 'Critical', color: 'var(--accent-rose)' },
            { key: 'warning', label: 'Warning', color: 'var(--accent-amber)' },
            { key: 'info', label: 'Info', color: 'var(--accent-primary)' },
          ].map(f => (
            <button key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
              style={filter === f.key ? { borderColor: f.color, backgroundColor: f.key === 'all' ? 'var(--text-primary)' : 'transparent', color: f.key === 'all' ? '#fff' : f.color } : {}}>
              {f.label}
              <span className="filter-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <button className="btn btn-secondary" onClick={() => setAlerts([])}>
          Clear All
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="alerts-feed">
        {filtered.length === 0 ? (
          <div className="alerts-empty editorial-card animate-scaleIn">
            <span style={{ display: 'inline-flex', marginBottom: '16px', color: 'var(--accent-primary)' }}>
              <CheckCircle size={48} />
            </span>
            <h3 className="font-serif">All Clear!</h3>
            <p>No alerts at this time. Your supply chain is running smoothly.</p>
          </div>
        ) : (
          filtered.map((alert, i) => (
            <div key={alert.id} className={`alert-card editorial-card alert-card-${alert.severity} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="alert-card-left">
                <span className="alert-card-icon">
                  <IconResolver name={alert.icon} size={20} />
                </span>
                <div className="alert-card-content">
                  <div className="alert-card-top">
                    <h4 className="font-serif">{alert.title}</h4>
                    <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                  </div>
                  <p className="alert-card-message">{alert.message}</p>
                </div>
              </div>
              <div className="alert-card-right">
                <span className="alert-card-time">{formatTime(alert.timestamp)}</span>
                <button className="alert-dismiss btn-icon" onClick={() => dismiss(alert.id)} title="Dismiss">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
