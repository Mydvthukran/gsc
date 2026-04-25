// Impact Calculator — Waste reduction, fuel savings, carbon metrics

import productCatalog from '../data/productCatalog';
import salesData from '../data/salesData';

/**
 * Calculate waste reduction metrics
 * Compares predicted-demand ordering vs. fixed-quantity ordering
 */
export function calculateWasteReduction() {
  let totalWasteWithout = 0;
  let totalWasteWith = 0;
  let totalUnits = 0;

  productCatalog.forEach(product => {
    const data = salesData[product.id];
    if (!data) return;

    const last30 = data.slice(-30);
    const dailySales = last30.map(d => d.unitsSold);
    const avgDemand = dailySales.reduce((a, b) => a + b, 0) / 30;
    const maxDemand = Math.max(...dailySales);
    const minDemand = Math.min(...dailySales);
    const variance = maxDemand - minDemand;

    // Without AI: order based on peak demand + large safety buffer (40%)
    // This leads to systematic overordering
    const fixedDailyOrder = (avgDemand + variance * 0.5) * 1.4;
    const wasteWithout = Math.max(0, fixedDailyOrder - avgDemand) * 30;

    // With AI: order based on predicted demand + small 10% buffer
    const smartDailyOrder = avgDemand * 1.1;
    const wasteWith = Math.max(0, smartDailyOrder - avgDemand) * 30;

    totalWasteWithout += wasteWithout;
    totalWasteWith += wasteWith;
    totalUnits += avgDemand * 30;
  });

  const wasteReduced = totalWasteWithout - totalWasteWith;
  const percentReduction = totalWasteWithout > 0
    ? (wasteReduced / totalWasteWithout) * 100
    : 0;

  return {
    wasteWithoutAI: Math.round(totalWasteWithout),
    wasteWithAI: Math.round(totalWasteWith),
    wasteReduced: Math.round(wasteReduced),
    percentReduction: Math.round(percentReduction * 10) / 10,
    totalUnitsSold: Math.round(totalUnits)
  };
}

/**
 * Calculate carbon emission savings from route optimization
 */
export function calculateCarbonSavings(routeResult) {
  if (!routeResult) {
    // Return demo values
    return {
      co2SavedPerTrip: 2.1,
      co2SavedMonthly: 63,
      co2SavedYearly: 766,
      treesEquivalent: 35,
      fuelSavedMonthly: 23.5,
      fuelSavedYearly: 282
    };
  }

  const { savings } = routeResult;
  const tripsPerMonth = 30;
  const tripsPerYear = 365;

  return {
    co2SavedPerTrip: savings.co2,
    co2SavedMonthly: Math.round(savings.co2 * tripsPerMonth * 100) / 100,
    co2SavedYearly: Math.round(savings.co2 * tripsPerYear),
    treesEquivalent: Math.round((savings.co2 * tripsPerYear) / 21.77), // 1 tree absorbs ~21.77 kg CO2/year
    fuelSavedMonthly: Math.round(savings.fuel * tripsPerMonth * 100) / 100,
    fuelSavedYearly: Math.round(savings.fuel * tripsPerYear)
  };
}

/**
 * Get overall efficiency metrics
 */
export function getEfficiencyMetrics(routeResult) {
  const waste = calculateWasteReduction();
  const carbon = calculateCarbonSavings(routeResult);

  return {
    waste,
    carbon,
    overall: {
      efficiencyScore: Math.round(
        (waste.percentReduction * 0.4 + (routeResult?.savings?.distancePercent || 20) * 0.4 + 85 * 0.2)
      ),
      costSavingsMonthly: Math.round(
        waste.wasteReduced * 3.5 / 12 + // avg product cost * waste units per month
        carbon.fuelSavedMonthly * 1.5 // fuel cost per liter
      ),
      sdg12Score: Math.min(100, Math.round(waste.percentReduction + 40)),
      sdg13Score: Math.min(100, Math.round((carbon.co2SavedYearly / 1000) * 100 + 30))
    }
  };
}

/**
 * Get monthly impact trend data for charts
 */
export function getMonthlyImpactTrend() {
  const months = [
    'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
    'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'
  ];

  return months.map((month, i) => ({
    month,
    wasteReduced: Math.round(40 + i * 8 + Math.random() * 15),
    co2Saved: Math.round(30 + i * 5 + Math.random() * 10),
    fuelSaved: Math.round(15 + i * 3 + Math.random() * 8),
    costSaved: Math.round(200 + i * 50 + Math.random() * 100)
  }));
}
