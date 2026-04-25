import { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import productCatalog from '../data/productCatalog';
import salesData, { getRollingAverage } from '../data/salesData';
import { predictDemand, getModelAccuracy, getDemandSummary } from '../utils/demandPredictor';
import IconResolver from '../components/IconResolver';
import { TrendingUp, Package, Clock, Target, AlertCircle, CheckCircle, BrainCircuit } from 'lucide-react';
import './ForecastPage.css';

export default function ForecastPage() {
  const [selectedProduct, setSelectedProduct] = useState('P001');
  const [forecastDays, setForecastDays] = useState(30);

  const product = productCatalog.find(p => p.id === selectedProduct);
  const productSales = salesData[selectedProduct] || [];

  const forecast = useMemo(() => predictDemand(productSales, forecastDays), [selectedProduct, forecastDays]);
  const accuracy = useMemo(() => getModelAccuracy(productSales), [selectedProduct]);
  const demandSummary = useMemo(
    () => getDemandSummary(productSales, product?.currentStock || 0, product?.reorderPoint || 0),
    [selectedProduct]
  );

  // Combine historical + forecast for chart
  const chartData = useMemo(() => {
    const rolling = getRollingAverage(selectedProduct, 7);
    const last60 = rolling.slice(-60).map(d => ({
      date: d.date.slice(5),
      actual: d.unitsSold,
      rollingAvg: d.rollingAvg,
      type: 'historical'
    }));

    const forecastData = forecast.map(f => ({
      date: f.date.slice(5),
      predicted: f.predicted,
      upper: f.upper,
      lower: f.lower,
      type: 'forecast'
    }));

    return [...last60, ...forecastData];
  }, [selectedProduct, forecastDays]);

  const tooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip glass-card" style={{ padding: '10px 14px' }}>
          <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 4 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '0.75rem' }}>
              {p.name}: {Math.round(p.value)} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="forecast-page">
      {/* Controls */}
      <div className="forecast-controls editorial-card animate-fadeIn">
        <div className="control-group">
          <label>Product</label>
          <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="select-input">
            {productCatalog.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Forecast Period</label>
          <div className="period-buttons">
            {[7, 14, 30].map(d => (
              <button key={d} className={`btn ${forecastDays === d ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setForecastDays(d)}>{d} days</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="forecast-stats">
        <div className="stat-card editorial-card animate-fadeInUp delay-1">
          <span className="stat-icon"><TrendingUp size={20} /></span>
          <div className="stat-value font-serif">{demandSummary.avgDailyDemand}</div>
          <div className="stat-label">Avg Daily Demand</div>
        </div>
        <div className="stat-card editorial-card animate-fadeInUp delay-2">
          <span className="stat-icon"><Package size={20} /></span>
          <div className="stat-value font-serif">{product?.currentStock}</div>
          <div className="stat-label">Current Stock</div>
        </div>
        <div className="stat-card editorial-card animate-fadeInUp delay-3">
          <span className="stat-icon"><Clock size={20} /></span>
          <div className="stat-value font-serif" style={{ color: demandSummary.daysOfStock < 5 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
            {demandSummary.daysOfStock} days
          </div>
          <div className="stat-label">Stock Duration</div>
        </div>
        <div className="stat-card editorial-card animate-fadeInUp delay-4">
          <span className="stat-icon"><Target size={20} /></span>
          <div className="stat-value font-serif">{Math.round(accuracy.r2 * 100)}%</div>
          <div className="stat-label">Model Accuracy (R²)</div>
        </div>
        <div className="stat-card editorial-card animate-fadeInUp delay-5">
          <span className="stat-icon" style={{ color: demandSummary.needsReorder ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
            {demandSummary.needsReorder ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          </span>
          <div className="stat-value font-serif" style={{ color: demandSummary.needsReorder ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
            {demandSummary.needsReorder ? demandSummary.suggestedOrder : 'OK'}
          </div>
          <div className="stat-label">{demandSummary.needsReorder ? 'Suggested Order' : 'Stock Healthy'}</div>
        </div>
      </div>

      {/* Main Forecast Chart */}
      <div className="forecast-chart editorial-card animate-fadeInUp delay-3">
        <div className="chart-header">
          <div>
            <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '12px', fontSize: '1.5rem' }}>
              <span style={{ display: 'inline-flex', padding: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                <IconResolver name={product?.icon} size={20} />
              </span>
              {product?.name} Demand Forecast
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>
              Historical data (solid) → AI Prediction (dashed) with confidence band
            </p>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-line" style={{ background: '#0A0A0A' }} />Actual</span>
            <span className="legend-item"><span className="legend-line" style={{ background: '#0033FF' }} />Predicted</span>
            <span className="legend-item"><span className="legend-line" style={{ background: 'rgba(0,51,255,0.1)' }} />Confidence</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradientForecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0033FF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0033FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0033FF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0033FF" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 1" stroke="rgba(0,0,0,0.1)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} interval={4} />
            <YAxis tick={{ fill: '#0A0A0A', fontSize: 11 }} axisLine={{ stroke: '#0A0A0A' }} tickLine={false} />
            <Tooltip content={tooltip} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#gradientConfidence)" name="Upper Bound" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="var(--bg-primary)" name="Lower Bound" />
            <Line type="monotone" dataKey="actual" stroke="#0A0A0A" strokeWidth={2} dot={false} name="Actual Sales" />
            <Line type="monotone" dataKey="rollingAvg" stroke="rgba(0,0,0,0.3)" strokeWidth={1} strokeDasharray="4 4" dot={false} name="7-day Avg" />
            <Line type="monotone" dataKey="predicted" stroke="#0033FF" strokeWidth={2.5} strokeDasharray="6 3" dot={false} name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Model Info */}
      <div className="model-info editorial-card animate-fadeInUp delay-4">
        <h3 className="flex-center font-serif" style={{ justifyContent: 'flex-start', gap: '12px', marginBottom: '24px', fontSize: '1.4rem' }}>
          <BrainCircuit size={24} /> AI Model Intelligence
        </h3>
        <div className="model-grid">
          <div className="model-stat">
            <span className="model-stat-label">Algorithm</span>
            <span className="model-stat-value">Weighted Moving Avg + Seasonal Decomposition</span>
          </div>
          <div className="model-stat">
            <span className="model-stat-label">Training Data</span>
            <span className="model-stat-value">365 days of historical sales</span>
          </div>
          <div className="model-stat">
            <span className="model-stat-label">MAE</span>
            <span className="model-stat-value">{accuracy.mae} units</span>
          </div>
          <div className="model-stat">
            <span className="model-stat-label">MAPE</span>
            <span className="model-stat-value">{accuracy.mape}%</span>
          </div>
          <div className="model-stat">
            <span className="model-stat-label">R² Score</span>
            <span className="model-stat-value">{accuracy.r2}</span>
          </div>
          <div className="model-stat">
            <span className="model-stat-label">Features</span>
            <span className="model-stat-value">Day of week, Month, Holiday, Trend, 7-day Avg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
