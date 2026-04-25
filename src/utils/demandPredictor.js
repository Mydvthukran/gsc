// Demand Prediction Engine using simple statistical forecasting
// Uses weighted moving average + seasonal decomposition for hackathon-friendly approach

/**
 * Calculate weighted moving average
 */
function weightedMovingAverage(data, window = 7) {
  const weights = [];
  let totalWeight = 0;
  for (let i = 0; i < window; i++) {
    const w = i + 1;
    weights.push(w);
    totalWeight += w;
  }

  const result = [];
  for (let i = window - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += data[i - window + 1 + j] * weights[j];
    }
    result.push(sum / totalWeight);
  }
  return result;
}

/**
 * Simple linear regression
 */
function linearRegression(x, y) {
  const n = x.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

/**
 * Calculate seasonal indices (day-of-week pattern)
 */
function calculateSeasonalIndices(salesData) {
  const dayTotals = Array(7).fill(0);
  const dayCounts = Array(7).fill(0);

  salesData.forEach(d => {
    dayTotals[d.dayOfWeek] += d.unitsSold;
    dayCounts[d.dayOfWeek] += 1;
  });

  const dayAvgs = dayTotals.map((total, i) => dayCounts[i] > 0 ? total / dayCounts[i] : 0);
  const overallAvg = dayAvgs.reduce((a, b) => a + b, 0) / 7;

  return dayAvgs.map(avg => overallAvg > 0 ? avg / overallAvg : 1);
}

/**
 * Generate demand forecast for the next N days
 */
export function predictDemand(salesData, forecastDays = 30) {
  if (!salesData || salesData.length < 14) return [];

  // Use last 90 days for model training
  const recentData = salesData.slice(-90);
  const values = recentData.map(d => d.unitsSold);

  // 1. Calculate trend using linear regression
  const x = values.map((_, i) => i);
  const { slope, intercept } = linearRegression(x, values);

  // 2. Calculate seasonal indices
  const seasonalIndices = calculateSeasonalIndices(recentData);

  // 3. Calculate recent volatility for confidence intervals
  const last14 = values.slice(-14);
  const mean14 = last14.reduce((a, b) => a + b, 0) / last14.length;
  const variance = last14.reduce((sum, v) => sum + Math.pow(v - mean14, 2), 0) / last14.length;
  const stdDev = Math.sqrt(variance);

  // 4. Generate forecast
  const lastDate = new Date(salesData[salesData.length - 1].date);
  const forecast = [];

  for (let i = 1; i <= forecastDays; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);

    const trendValue = intercept + slope * (recentData.length + i);
    const dayOfWeek = futureDate.getDay();
    const seasonalFactor = seasonalIndices[dayOfWeek];

    const predicted = Math.max(0, Math.round(trendValue * seasonalFactor));
    const lower = Math.max(0, Math.round(predicted - 1.5 * stdDev));
    const upper = Math.round(predicted + 1.5 * stdDev);

    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      predicted,
      lower,
      upper,
      dayOfWeek,
      confidence: Math.max(60, Math.round(95 - (i * 0.8))) // Confidence decreases over time
    });
  }

  return forecast;
}

/**
 * Get model accuracy metrics
 */
export function getModelAccuracy(salesData) {
  if (!salesData || salesData.length < 30) {
    return { mae: 0, mape: 0, r2: 0 };
  }

  // Evaluate with rolling 7-day-ahead predictions using multiple windows
  const windowSize = 90;
  const forecastHorizon = 7;
  const actualValues = [];
  const predictedValues = [];

  // Use 3 evaluation windows for stability
  const evalPoints = [
    salesData.length - 30,
    salesData.length - 60,
    salesData.length - 90
  ].filter(p => p >= windowSize);

  for (const startEval of evalPoints) {
    const trainData = salesData.slice(0, startEval);
    const testData = salesData.slice(startEval, startEval + forecastHorizon);
    const forecast = predictDemand(trainData, forecastHorizon);

    for (let i = 0; i < Math.min(testData.length, forecast.length); i++) {
      actualValues.push(testData[i].unitsSold);
      predictedValues.push(forecast[i].predicted);
    }
  }

  if (actualValues.length === 0) return { mae: 0, mape: 0, r2: 0 };

  let totalError = 0;
  let totalPercentError = 0;
  const n = actualValues.length;

  for (let i = 0; i < n; i++) {
    totalError += Math.abs(actualValues[i] - predictedValues[i]);
    if (actualValues[i] > 0) {
      totalPercentError += Math.abs(actualValues[i] - predictedValues[i]) / actualValues[i];
    }
  }

  const mae = Math.round((totalError / n) * 10) / 10;
  const mape = Math.round((totalPercentError / n) * 1000) / 10;

  // R² calculation
  const actualMean = actualValues.reduce((a, b) => a + b, 0) / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    ssRes += Math.pow(actualValues[i] - predictedValues[i], 2);
    ssTot += Math.pow(actualValues[i] - actualMean, 2);
  }
  const r2 = Math.round((1 - ssRes / ssTot) * 100) / 100;

  return { mae, mape, r2: Math.max(0, r2) };
}

/**
 * Get demand summary for a product
 */
export function getDemandSummary(salesData, currentStock, reorderPoint) {
  const forecast = predictDemand(salesData, 7);
  const next7DayDemand = forecast.reduce((sum, f) => sum + f.predicted, 0);

  const daysOfStock = next7DayDemand > 0
    ? Math.round((currentStock / (next7DayDemand / 7)) * 10) / 10
    : 999;

  const needsReorder = currentStock < reorderPoint || daysOfStock < 5;
  const isOverstocked = currentStock > reorderPoint * 3;

  return {
    next7DayDemand,
    avgDailyDemand: Math.round(next7DayDemand / 7),
    daysOfStock,
    needsReorder,
    isOverstocked,
    suggestedOrder: needsReorder ? Math.round(next7DayDemand * 1.2 - currentStock) : 0
  };
}
