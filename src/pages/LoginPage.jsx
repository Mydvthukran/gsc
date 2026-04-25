import useAuth from '../hooks/useAuth';
import { Zap, BrainCircuit, Map, LayoutDashboard, Leaf, Info, Cloud, Code } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, loading, error, isFirebaseConfigured } = useAuth();

  return (
    <div className="login-page">
      {/* Editorial Background */}
      <div className="login-bg">
        <div className="bg-grid" />
        <div className="bg-line" />
      </div>

      <div className="login-container editorial-card animate-scaleIn">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-mark font-serif">WGB</div>
          <h1 className="font-serif">OptiChain<span className="dot">.</span></h1>
          <p className="login-tagline">Editorial Intelligence for Global Logistics</p>
        </div>

        {/* SDG Indicators */}
        <div className="login-sdg-row">
          <div className="login-sdg-chip">
            <span className="sdg-chip-num">12</span>
            <span>SUSTAINABILITY</span>
          </div>
          <div className="login-sdg-chip">
            <span className="sdg-chip-num">13</span>
            <span>CLIMATE ACTION</span>
          </div>
        </div>

        {/* Intelligence Features */}
        <div className="login-features">
          {[
            { icon: <BrainCircuit size={16} />, label: 'Neural Demand' },
            { icon: <Map size={16} />, label: 'Path Optimization' },
            { icon: <LayoutDashboard size={16} />, label: 'Real-time Pulse' },
            { icon: <Leaf size={16} />, label: 'Carbon Ledger' },
          ].map((f, i) => (
            <div className="login-feature" key={i}>
              <span className="feature-icon">{f.icon}</span>
              <span className="feature-label">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button className="login-btn btn btn-primary" onClick={login} disabled={loading}>
          {loading ? (
            <span className="login-spinner" />
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              AUTHENTICATE WITH GOOGLE
            </>
          )}
        </button>

        {error && <p className="login-error">FAILURE: {error}</p>}

        {!isFirebaseConfigured && (
          <div className="login-demo-note">
            <Info size={16} />
            <span>DEMO MODE ACTIVE — CLICK TO INITIALIZE SESSION</span>
          </div>
        )}

        {/* Footer */}
        <div className="login-footer">
          <p className="font-serif">Powered by Google Cloud & AI</p>
          <div className="login-tech-icons">
            <span title="Firebase"><Code size={18} /></span>
            <span title="Google Cloud"><Cloud size={18} /></span>
            <span title="TensorFlow"><BrainCircuit size={18} /></span>
            <span title="Google Maps"><Map size={18} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
