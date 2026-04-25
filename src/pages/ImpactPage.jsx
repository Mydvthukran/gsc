import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getEfficiencyMetrics, getMonthlyImpactTrend } from '../utils/impactCalculator';
import { Recycle, PackageOpen, Brain, Leaf, TreePine, Fuel, Zap, TrendingDown, Cloud } from 'lucide-react';
import './ImpactPage.css';

export default function ImpactPage() {
  const metrics = useMemo(() => getEfficiencyMetrics(null), []);
  const trend = useMemo(() => getMonthlyImpactTrend(), []);

  const tooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip glass-card" style={{ padding: '10px 14px' }}>
          <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 4 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '0.75rem' }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="impact-page">
      {/* SDG Cards */}
      <div className="sdg-cards">
        <div className="sdg-card editorial-card animate-fadeInUp delay-1">
          <div className="sdg-card-header">
            <div className="sdg-number sdg-12">12</div>
            <div>
              <h3 className="font-serif">Responsible Consumption</h3>
              <p>UN Sustainable Development Goal 12</p>
            </div>
          </div>
          <div className="sdg-score-bar">
            <div className="sdg-score-fill" style={{ width: `${metrics.overall.sdg12Score}%`, background: 'var(--text-primary)' }} />
          </div>
          <span className="sdg-score-label">Impact Score: {metrics.overall.sdg12Score}/100</span>
          <div className="sdg-impacts">
            <div className="sdg-impact-item">
              <span className="impact-icon"><Recycle size={18} /></span>
              <span>{metrics.waste.percentReduction}% waste reduction achieved</span>
            </div>
            <div className="sdg-impact-item">
              <span className="impact-icon"><PackageOpen size={18} /></span>
              <span>{metrics.waste.wasteReduced} units of waste prevented monthly</span>
            </div>
            <div className="sdg-impact-item">
              <span className="impact-icon"><Brain size={18} /></span>
              <span>AI-driven demand prediction for precise ordering</span>
            </div>
          </div>
        </div>

        <div className="sdg-card editorial-card animate-fadeInUp delay-2">
          <div className="sdg-card-header">
            <div className="sdg-number sdg-13">13</div>
            <div>
              <h3 className="font-serif">Climate Action</h3>
              <p>UN Sustainable Development Goal 13</p>
            </div>
          </div>
          <div className="sdg-score-bar">
            <div className="sdg-score-fill" style={{ width: `${metrics.overall.sdg13Score}%`, background: 'var(--accent-primary)' }} />
          </div>
          <span className="sdg-score-label">Impact Score: {metrics.overall.sdg13Score}/100</span>
          <div className="sdg-impacts">
            <div className="sdg-impact-item">
              <span className="impact-icon"><Leaf size={18} /></span>
              <span>{metrics.carbon.co2SavedYearly} kg CO₂ saved annually</span>
            </div>
            <div className="sdg-impact-item">
              <span className="impact-icon"><TreePine size={18} /></span>
              <span>Equivalent to {metrics.carbon.treesEquivalent} trees planted per year</span>
            </div>
            <div className="sdg-impact-item">
              <span className="impact-icon"><Fuel size={18} /></span>
              <span>{metrics.carbon.fuelSavedYearly} liters of fuel saved yearly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="efficiency-card editorial-card animate-fadeInUp delay-3">
        <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '12px', fontSize: '1.5rem' }}>
          <Zap size={24} /> Overall Efficiency Performance
        </h3>
        <div className="efficiency-display">
          <div className="efficiency-ring">
            <svg viewBox="0 0 120 120" className="ring-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-tertiary)" strokeWidth="4" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent-primary)" strokeWidth="8"
                strokeDasharray={`${metrics.overall.efficiencyScore * 3.27} 327`}
                strokeDashoffset="0" strokeLinecap="square"
                transform="rotate(-90 60 60)" className="ring-progress" />
              <text x="60" y="58" textAnchor="middle" fill="var(--text-primary)" fontSize="32" fontWeight="500" className="font-serif">
                {metrics.overall.efficiencyScore}
              </text>
              <text x="60" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10" fontWeight="700" letterSpacing="0.1em">
                SCORE / 100
              </text>
            </svg>
          </div>
          <div className="efficiency-breakdown">
            {[
              { label: 'Waste Reduction', value: metrics.waste.percentReduction, suffix: '%' },
              { label: 'Route Efficiency', value: 22, suffix: '%' },
              { label: 'Carbon Reduction', value: 18, suffix: '%' },
              { label: 'Cost Savings', value: metrics.overall.costSavingsMonthly, prefix: '$', suffix: '/mo' }
            ].map((item, idx) => (
              <div className="breakdown-item" key={idx}>
                <span className="breakdown-label">{item.label}</span>
                <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${item.value}%` }} /></div>
                <span className="breakdown-value font-serif">{item.prefix}{item.value}{item.suffix}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="impact-charts">
        <div className="impact-chart editorial-card animate-fadeInUp delay-4">
          <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '24px' }}>
            <TrendingDown size={18} /> Waste Reduction Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="1 1" stroke="rgba(0,0,0,0.1)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
              <YAxis tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
              <Tooltip content={tooltip} />
              <Area type="monotone" dataKey="wasteReduced" stroke="#0A0A0A" strokeWidth={2} fill="url(#wasteGrad)" name="Waste Reduced (units)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="impact-chart editorial-card animate-fadeInUp delay-5">
          <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '24px' }}>
            <Cloud size={18} /> CO₂ Savings Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="1 1" stroke="rgba(0,0,0,0.1)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
              <YAxis tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
              <Tooltip content={tooltip} />
              <Bar dataKey="co2Saved" fill="#0033FF" name="CO₂ Saved (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
