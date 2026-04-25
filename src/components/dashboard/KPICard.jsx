import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import IconResolver from '../IconResolver';
import './KPICard.css';

export default function KPICard({ title, value, subtitle, icon, trend, trendValue, color = 'emerald', delay = 0 }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      el.style.animationDelay = `${delay * 0.1}s`;
    }
  }, [delay]);

  const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : '';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div ref={cardRef} className={`kpi-card editorial-card animate-fadeInUp delay-${delay}`}>
      <div className="kpi-header">
        <span className={`kpi-icon`}>
          <IconResolver name={icon} size={20} />
        </span>
        <span className={`kpi-trend flex-center gap-sm`}>
          <TrendIcon size={14} /> {trendValue}
        </span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
    </div>
  );
}
