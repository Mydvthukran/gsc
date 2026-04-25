// Generate realistic simulated sales data for 12 months
// Each product gets daily sales with seasonal patterns, trends, and noise

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateProductSales(productId, baseDemand, seasonality, trend, seed) {
  const rng = seededRandom(seed);
  const data = [];
  const startDate = new Date('2025-04-01');

  for (let day = 0; day < 365; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    // Weekend boost
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;

    // Seasonal pattern (sine wave over year)
    const seasonalFactor = 1 + seasonality * Math.sin((2 * Math.PI * day) / 365);

    // Linear trend
    const trendFactor = 1 + (trend * day) / 365;

    // Holiday spikes
    const isHoliday = (month === 11 && date.getDate() >= 20) || // Christmas
      (month === 10 && date.getDate() >= 25) || // Black Friday
      (month === 0 && date.getDate() <= 3); // New Year
    const holidayFactor = isHoliday ? 1.5 : 1.0;

    // Random noise
    const noise = 0.7 + rng() * 0.6;

    const unitsSold = Math.max(
      0,
      Math.round(baseDemand * weekendFactor * seasonalFactor * trendFactor * holidayFactor * noise)
    );

    data.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek,
      month,
      isHoliday: isHoliday ? 1 : 0,
      unitsSold,
      productId
    });
  }

  return data;
}

// Configuration per product
const salesConfig = {
  P001: { baseDemand: 45, seasonality: 0.15, trend: 0.08, seed: 42 },
  P002: { baseDemand: 35, seasonality: 0.10, trend: 0.05, seed: 123 },
  P003: { baseDemand: 55, seasonality: 0.30, trend: 0.12, seed: 456 },
  P004: { baseDemand: 25, seasonality: 0.08, trend: 0.03, seed: 789 },
  P005: { baseDemand: 18, seasonality: 0.05, trend: 0.10, seed: 101 },
  P006: { baseDemand: 38, seasonality: 0.20, trend: -0.05, seed: 202 },
  P007: { baseDemand: 30, seasonality: 0.25, trend: 0.15, seed: 303 },
  P008: { baseDemand: 40, seasonality: 0.12, trend: 0.07, seed: 404 },
  P009: { baseDemand: 22, seasonality: 0.06, trend: 0.02, seed: 505 },
  P010: { baseDemand: 28, seasonality: 0.08, trend: 0.04, seed: 606 },
  P011: { baseDemand: 20, seasonality: 0.18, trend: 0.06, seed: 707 },
  P012: { baseDemand: 50, seasonality: 0.10, trend: 0.09, seed: 808 }
};

// Generate all sales data
const salesData = {};
Object.entries(salesConfig).forEach(([productId, config]) => {
  salesData[productId] = generateProductSales(
    productId,
    config.baseDemand,
    config.seasonality,
    config.trend,
    config.seed
  );
});

// Helper: get last N days of sales for a product
export function getRecentSales(productId, days = 30) {
  const data = salesData[productId] || [];
  return data.slice(-days);
}

// Helper: get monthly aggregates
export function getMonthlySales(productId) {
  const data = salesData[productId] || [];
  const monthly = {};
  data.forEach(d => {
    const key = d.date.substring(0, 7);
    if (!monthly[key]) monthly[key] = { month: key, total: 0, days: 0 };
    monthly[key].total += d.unitsSold;
    monthly[key].days += 1;
  });
  return Object.values(monthly).map(m => ({
    ...m,
    avgDaily: Math.round(m.total / m.days)
  }));
}

// Helper: get 7-day rolling average
export function getRollingAverage(productId, window = 7) {
  const data = salesData[productId] || [];
  return data.map((d, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((sum, s) => sum + s.unitsSold, 0) / slice.length;
    return { date: d.date, unitsSold: d.unitsSold, rollingAvg: Math.round(avg * 10) / 10 };
  });
}

export default salesData;
