// Alert rules and thresholds for inventory monitoring

const alertRules = {
  lowStock: {
    type: 'LOW_STOCK',
    severity: 'critical',
    label: 'Low Stock Alert',
    icon: 'AlertCircle',
    description: 'Stock level has fallen below the reorder point',
    check: (product) => product.currentStock < product.reorderPoint
  },
  overstock: {
    type: 'OVERSTOCK',
    severity: 'warning',
    label: 'Overstock Warning',
    icon: 'AlertTriangle',
    description: 'Stock level exceeds 90% of maximum capacity',
    check: (product) => product.currentStock > product.maxStock * 0.9
  },
  expiringStock: {
    type: 'EXPIRING',
    severity: 'warning',
    label: 'Expiring Soon',
    icon: 'Clock',
    description: 'Products approaching shelf-life expiry',
    check: (product) => product.shelfLife <= 7
  },
  routeInefficient: {
    type: 'ROUTE_INEFFICIENT',
    severity: 'info',
    label: 'Route Optimization Available',
    icon: 'Map',
    description: 'A more efficient delivery route has been calculated',
    check: () => true
  }
};

// Generate demo alerts from current product catalog
export function generateAlerts(products) {
  const alerts = [];
  const now = new Date();

  products.forEach(product => {
    if (alertRules.lowStock.check(product)) {
      alerts.push({
        id: `alert-low-${product.id}`,
        type: 'LOW_STOCK',
        severity: 'critical',
        title: `Low Stock: ${product.name}`,
        message: `Only ${product.currentStock} ${product.unit} remaining (reorder point: ${product.reorderPoint})`,
        product: product.id,
        productName: product.name,
        icon: product.icon,
        timestamp: new Date(now - Math.random() * 3600000).toISOString(),
        dismissed: false
      });
    }

    if (alertRules.overstock.check(product)) {
      alerts.push({
        id: `alert-over-${product.id}`,
        type: 'OVERSTOCK',
        severity: 'warning',
        title: `Overstock: ${product.name}`,
        message: `${product.currentStock} ${product.unit} in stock (max capacity: ${product.maxStock}). Consider reducing next order.`,
        product: product.id,
        productName: product.name,
        icon: product.icon,
        timestamp: new Date(now - Math.random() * 7200000).toISOString(),
        dismissed: false
      });
    }

    if (product.shelfLife <= 7) {
      alerts.push({
        id: `alert-exp-${product.id}`,
        type: 'EXPIRING',
        severity: 'warning',
        title: `Expiring Soon: ${product.name}`,
        message: `Shelf life is only ${product.shelfLife} days. Prioritize sales or promotions.`,
        product: product.id,
        productName: product.name,
        icon: product.icon,
        timestamp: new Date(now - Math.random() * 5400000).toISOString(),
        dismissed: false
      });
    }
  });

  // Add a route optimization alert
  alerts.push({
    id: 'alert-route-001',
    type: 'ROUTE_INEFFICIENT',
    severity: 'info',
    title: 'Route Optimization Available',
    message: 'A more efficient delivery route has been found — saving 18.3 km and 2.1 kg CO₂.',
    icon: 'Map',
    timestamp: new Date(now - 1800000).toISOString(),
    dismissed: false
  });

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export default alertRules;
