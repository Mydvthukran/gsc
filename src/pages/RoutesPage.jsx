import { useState, useMemo, useRef, useEffect } from 'react';
import retailerLocations from '../data/retailerLocations';
import { optimizeRoute, formatRouteSteps, haversineDistance } from '../utils/routeOptimizer';
import { Map, XCircle, CheckCircle2, Warehouse, Flag, MapPin } from 'lucide-react';
import './RoutesPage.css';

export default function RoutesPage() {
  const canvasRef = useRef(null);
  const [showOptimized, setShowOptimized] = useState(true);
  const [selectedStop, setSelectedStop] = useState(null);

  const routeResult = useMemo(() => optimizeRoute(retailerLocations), []);
  const routeSteps = useMemo(() => formatRouteSteps(routeResult), [routeResult]);

  // Draw map on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !routeResult) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Get bounds
    const lats = retailerLocations.map(l => l.lat);
    const lngs = retailerLocations.map(l => l.lng);
    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.02;
    const maxLng = Math.max(...lngs) + 0.02;

    const toX = lng => ((lng - minLng) / (maxLng - minLng)) * (w - 80) + 40;
    const toY = lat => h - ((lat - minLat) / (maxLat - minLat)) * (h - 80) - 40;

    // Background
    ctx.fillStyle = '#0f1729';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(148,163,184,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo((w / 20) * i, 0);
      ctx.lineTo((w / 20) * i, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, (h / 20) * i);
      ctx.lineTo(w, (h / 20) * i);
      ctx.stroke();
    }

    const route = showOptimized ? routeResult.optimized.route : routeResult.naive.route;

    // Draw route lines
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = showOptimized ? '#10b981' : '#f43f5e';
    ctx.setLineDash(showOptimized ? [] : [8, 4]);
    ctx.shadowColor = showOptimized ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)';
    ctx.shadowBlur = 8;

    ctx.beginPath();
    route.forEach((loc, i) => {
      const x = toX(loc.lng);
      const y = toY(loc.lat);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);

    // Draw direction arrows along the route
    for (let i = 0; i < route.length - 1; i++) {
      const x1 = toX(route[i].lng), y1 = toY(route[i].lat);
      const x2 = toX(route[i + 1].lng), y2 = toY(route[i + 1].lat);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1);

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.fillStyle = showOptimized ? '#10b981' : '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw locations
    retailerLocations.forEach((loc) => {
      const x = toX(loc.lng);
      const y = toY(loc.lat);
      const isWarehouse = loc.type === 'warehouse';
      const isSelected = selectedStop === loc.id;

      // Glow
      if (isWarehouse || isSelected) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
        gradient.addColorStop(0, isWarehouse ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 25, y - 25, 50, 50);
      }

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, isWarehouse ? 10 : 7, 0, Math.PI * 2);
      ctx.fillStyle = isWarehouse ? '#3b82f6' : (isSelected ? '#10b981' : '#94a3b8');
      ctx.fill();
      ctx.strokeStyle = '#0f1729';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${isWarehouse ? 'bold' : 'normal'} 11px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(loc.name.split(' ').slice(0, 2).join(' '), x, y - 14);
    });

    // Draw step numbers on optimized route
    if (showOptimized) {
      route.forEach((loc, i) => {
        if (i === 0 || i === route.length - 1) return;
        const x = toX(loc.lng);
        const y = toY(loc.lat);

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x + 12, y - 12, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i, x + 12, y - 12);
        ctx.textBaseline = 'alphabetic';
      });
    }

  }, [routeResult, showOptimized, selectedStop]);

  if (!routeResult) return <div>Loading...</div>;

  const { naive, optimized, savings, metadata } = routeResult;
  const displayRoute = showOptimized ? optimized : naive;

  return (
    <div className="routes-page">
      {/* Toggle & Stats Bar */}
      <div className="route-controls editorial-card animate-fadeIn">
        <div className="route-toggle">
          <button className={`btn ${!showOptimized ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowOptimized(false)}
            style={!showOptimized ? { backgroundColor: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' } : {}}>
            <XCircle size={18} /> Naive Route
          </button>
          <button className={`btn ${showOptimized ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowOptimized(true)}>
            <CheckCircle2 size={18} /> Optimized Route
          </button>
        </div>
        <div className="route-quick-stats">
          {[
            { label: 'Distance', value: `${displayRoute.distance} km` },
            { label: 'Est. Time', value: `${displayRoute.time} min` },
            { label: 'Fuel', value: `${displayRoute.fuel} L` },
            { label: 'Stops', value: metadata.stopsCount },
          ].map((s, idx) => (
            <div className="quick-stat" key={idx}>
              <span className="quick-label">{s.label}</span>
              <span className="quick-value font-serif">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="route-main">
        {/* Map */}
        <div className="route-map editorial-card animate-fadeInUp delay-2">
          <div className="map-header">
            <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '12px', fontSize: '1.5rem' }}>
              <Map size={24} /> Delivery Route Intelligence
            </h3>
            <span className="badge badge-success">{metadata.algorithm}</span>
          </div>
          <div style={{ border: '1px solid var(--border-color)', background: '#0A0A0A' }}>
            <canvas ref={canvasRef} className="route-canvas" />
          </div>
          <div className="map-legend font-sans">
            <span>🔵 Warehouse</span>
            <span>⚪ Retailers</span>
            <span style={{ color: 'var(--accent-primary)' }}>— Optimized</span>
            <span style={{ color: 'var(--accent-rose)' }}>--- Naive</span>
          </div>
        </div>

        {/* Delivery Steps */}
        <div className="route-sidebar">
          {/* Savings Card */}
          <div className="savings-card editorial-card animate-fadeInUp delay-3">
            <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Optimization Gains</h3>
            <div className="savings-grid">
              <div className="saving-item">
                <span className="saving-value font-serif">{savings.distancePercent}%</span>
                <span className="saving-label">Efficiency</span>
              </div>
              <div className="saving-item">
                <span className="saving-value font-serif">{savings.distance} km</span>
                <span className="saving-label">Saved</span>
              </div>
              <div className="saving-item">
                <span className="saving-value font-serif">{savings.co2} kg</span>
                <span className="saving-label">CO₂ Reduced</span>
              </div>
              <div className="saving-item">
                <span className="saving-value font-serif">{savings.time} min</span>
                <span className="saving-label">Time Saved</span>
              </div>
            </div>
          </div>

          {/* Route Steps */}
          <div className="steps-card editorial-card animate-fadeInUp delay-4">
            <h3 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Delivery Sequence</h3>
            <div className="steps-list">
              {routeSteps.map((step, i) => (
                <div key={i} className={`step-item ${selectedStop === step.location.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStop(step.location.id)}
                  onMouseEnter={() => setSelectedStop(step.location.id)}
                  onMouseLeave={() => setSelectedStop(null)}>
                  <div className={`step-number ${step.isStart || step.isEnd ? 'step-terminal' : ''}`}>
                    {step.isStart ? <Warehouse size={14} /> : step.isEnd ? <Flag size={14} /> : step.step - 1}
                  </div>
                  <div className="step-info">
                    <span className="step-name font-serif">{step.location.name}</span>
                    <span className="step-detail">
                      {step.distanceFromPrevious > 0 ? `${step.distanceFromPrevious} km • ${step.estimatedTime} min` : 'Start'}
                    </span>
                  </div>
                  {step.location.demand && (
                    <span className="step-demand font-serif">{step.location.demand} units</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
