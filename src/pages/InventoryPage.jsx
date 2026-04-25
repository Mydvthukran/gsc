import { useMemo } from 'react';
import productCatalog from '../data/productCatalog';
import salesData from '../data/salesData';
import { getDemandSummary } from '../utils/demandPredictor';
import IconResolver from '../components/IconResolver';
import { Package, DollarSign, AlertCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import './InventoryPage.css';

export default function InventoryPage() {
  const inventory = useMemo(() => {
    return productCatalog.map(product => {
      const pSales = salesData[product.id] || [];
      const summary = getDemandSummary(pSales, product.currentStock, product.reorderPoint);
      const stockPercent = Math.round((product.currentStock / product.maxStock) * 100);

      let status = 'normal';
      if (product.currentStock < product.reorderPoint) status = 'critical';
      else if (product.currentStock > product.maxStock * 0.9) status = 'overstock';
      else if (product.currentStock < product.reorderPoint * 1.5) status = 'warning';

      return { ...product, ...summary, stockPercent, status };
    });
  }, []);

  const totalValue = inventory.reduce((sum, p) => sum + p.currentStock * p.unitCost, 0);
  const criticalCount = inventory.filter(p => p.status === 'critical').length;
  const overstockCount = inventory.filter(p => p.status === 'overstock').length;

  return (
    <div className="inventory-page">
      {/* Summary Cards */}
      <div className="inv-summary animate-fadeIn">
        <div className="inv-summary-card editorial-card">
          <span className="inv-sum-icon"><Package size={20} /></span>
          <div><span className="inv-sum-value font-serif">{productCatalog.length}</span><span className="inv-sum-label">Total Products</span></div>
        </div>
        <div className="inv-summary-card editorial-card">
          <span className="inv-sum-icon"><DollarSign size={20} /></span>
          <div><span className="inv-sum-value font-serif">${totalValue.toLocaleString()}</span><span className="inv-sum-label">Inventory Value</span></div>
        </div>
        <div className="inv-summary-card editorial-card">
          <span className="inv-sum-icon" style={{ color: 'var(--accent-rose)' }}><AlertCircle size={20} /></span>
          <div><span className="inv-sum-value font-serif" style={{ color: 'var(--accent-rose)' }}>{criticalCount}</span><span className="inv-sum-label">Low Stock</span></div>
        </div>
        <div className="inv-summary-card editorial-card">
          <span className="inv-sum-icon" style={{ color: 'var(--accent-amber)' }}><AlertTriangle size={20} /></span>
          <div><span className="inv-sum-value font-serif" style={{ color: 'var(--accent-amber)' }}>{overstockCount}</span><span className="inv-sum-label">Overstock</span></div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inv-table-wrapper editorial-card animate-fadeInUp delay-2">
        <div className="inv-table-header flex-center" style={{ justifyContent: 'flex-start', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <ClipboardList size={24} />
          <h3 className="font-serif" style={{ fontSize: '1.5rem' }}>Inventory Status</h3>
        </div>
        <div className="inv-table-container">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Current / Max</th>
                <th>Status</th>
                <th>Days Left</th>
                <th>Avg Daily</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id} className={`inv-row inv-row-${item.status}`}>
                  <td className="inv-product">
                    <span className="inv-icon">
                      <IconResolver name={item.icon} size={16} />
                    </span>
                    <span className="font-serif">{item.name}</span>
                  </td>
                  <td className="inv-category">{item.category}</td>
                  <td>
                    <div className="stock-bar-container">
                      <div className="progress-bar">
                        <div className={`progress-bar-fill ${item.status === 'critical' ? 'critical' : item.status === 'overstock' ? 'warning' : ''}`}
                          style={{ width: `${Math.min(100, item.stockPercent)}%` }} />
                      </div>
                      <span className="stock-percent">{item.stockPercent}%</span>
                    </div>
                  </td>
                  <td className="inv-stock-nums">
                    <strong>{item.currentStock}</strong> / {item.maxStock} {item.unit}
                  </td>
                  <td>
                    <span className={`badge badge-${item.status === 'critical' ? 'critical' : item.status === 'overstock' ? 'warning' : item.status === 'warning' ? 'warning' : 'success'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: item.daysOfStock < 5 ? 'var(--accent-rose)' : item.daysOfStock > 30 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                    {item.daysOfStock > 100 ? '100+' : item.daysOfStock} days
                  </td>
                  <td>{item.avgDailyDemand} {item.unit}/day</td>
                  <td>
                    {item.needsReorder ? (
                      <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                        Order {item.suggestedOrder}
                      </button>
                    ) : item.isOverstocked ? (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', fontStyle: 'italic' }}>Reduce next order</span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>No action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
