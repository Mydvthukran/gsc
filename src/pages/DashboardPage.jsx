import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard from '../components/dashboard/KPICard';
import productCatalog from '../data/productCatalog';
import salesData, { getMonthlySales } from '../data/salesData';
import { generateAlerts } from '../data/alertRules';
import { getEfficiencyMetrics } from '../utils/impactCalculator';
import IconResolver from '../components/IconResolver';
import './DashboardPage.css';

// Premium Palette matching CSS variables
const COLORS = ['#0A0A0A', '#0033FF', '#4A4A4A', '#D0D0D0', '#808080', '#1C1C1C'];

export default function DashboardPage() {
  const alerts = useMemo(() => generateAlerts(productCatalog), []);
  const metrics = useMemo(() => getEfficiencyMetrics(null), []);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const lowStockProducts = productCatalog.filter(p => p.currentStock < p.reorderPoint).length;
  const overstockedProducts = productCatalog.filter(p => p.currentStock > p.maxStock * 0.9).length;

  // Sales trend for mini chart
  const salesTrend = useMemo(() => {
    const monthly = getMonthlySales('P001');
    return monthly.slice(-6).map(m => ({ name: m.month.slice(5), value: m.total }));
  }, []);

  // Category distribution for pie chart
  const categoryData = useMemo(() => {
    const cats = {};
    productCatalog.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + p.currentStock;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, []);

  // Stock levels for bar chart
  const stockLevels = useMemo(() => {
    return productCatalog.slice(0, 8).map(p => ({
      name: p.icon,
      current: p.currentStock,
      max: p.maxStock,
      reorder: p.reorderPoint,
      fullName: p.name
    }));
  }, []);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip glass-card">
          <p className="tooltip-label">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '0.78rem' }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Products" value={productCatalog.length} icon="Package"
          trend="up" trendValue="+2 new" color="emerald" delay={1}
          subtitle="Across 7 categories"
        />
        <KPICard
          title="Active Alerts" value={alerts.length} icon="Bell"
          trend={criticalAlerts > 0 ? 'down' : 'up'}
          trendValue={`${criticalAlerts} critical`} color="rose" delay={2}
          subtitle={`${lowStockProducts} low stock, ${overstockedProducts} overstock`}
        />
        <KPICard
          title="Routes Today" value="8" icon="Truck"
          trend="up" trendValue="22% shorter" color="blue" delay={3}
          subtitle="Optimized via AI routing"
        />
        <KPICard
          title="CO₂ Saved" value={`${metrics.carbon.co2SavedMonthly} kg`} icon="Leaf"
          trend="up" trendValue="This month" color="emerald" delay={4}
          subtitle={`≈ ${metrics.carbon.treesEquivalent} trees/year`}
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Sales Trend */}
        <div className="chart-card glass-card animate-fadeInUp delay-3">
          <div className="chart-header">
            <h3>Sales Trend (6 Months)</h3>
            <span className="badge badge-success">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0033FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0033FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#4A4A4A', fontSize: 12 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#4A4A4A', fontSize: 12 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} dx={-10} />
              <Tooltip content={customTooltip} cursor={{ stroke: '#0A0A0A', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area type="monotone" dataKey="value" stroke="#0033FF" strokeWidth={2} fill="url(#gradientBlue)" activeDot={{ r: 4, fill: '#0A0A0A', stroke: '#0033FF', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Levels */}
        <div className="chart-card editorial-card animate-fadeInUp delay-4">
          <div className="chart-header">
            <h3>Stock Levels</h3>
            <span className="badge badge-info">8 products</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockLevels} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 14 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#4A4A4A', fontSize: 12 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
              <Tooltip content={customTooltip} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="current" fill="#0A0A0A" radius={[2, 2, 0, 0]} name="Current" barSize={12} />
              <Bar dataKey="reorder" fill="#0033FF" radius={[2, 2, 0, 0]} name="Reorder Point" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-card editorial-card animate-fadeInUp delay-5">
          <div className="chart-header">
            <h3>Category Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={2} dataKey="value" stroke="#FDFCF8" strokeWidth={2}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {categoryData.map((cat, i) => (
              <span key={cat.name} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="recent-section editorial-card animate-fadeInUp delay-6">
        <div className="chart-header">
          <h3>Recent Alerts</h3>
          <span className="badge badge-critical">{criticalAlerts} critical</span>
        </div>
        <div className="alerts-list">
          {alerts.slice(0, 5).map(alert => (
            <div key={alert.id} className={`alert-row alert-${alert.severity} clickable`}>
              <span className="alert-icon">
                <IconResolver name={alert.icon} size={20} />
              </span>
              <div className="alert-content">
                <span className="alert-title">{alert.title}</span>
                <span className="alert-message">{alert.message}</span>
              </div>
              <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
