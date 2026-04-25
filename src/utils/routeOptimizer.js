// Route Optimization Engine
// Implements Nearest Neighbor heuristic + 2-opt improvement

/**
 * Calculate Haversine distance between two lat/lng points (in km)
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Build distance matrix between all locations
 */
function buildDistanceMatrix(locations) {
  const n = locations.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist = haversineDistance(
        locations[i].lat, locations[i].lng,
        locations[j].lat, locations[j].lng
      );
      matrix[i][j] = dist;
      matrix[j][i] = dist;
    }
  }
  return matrix;
}

/**
 * Nearest Neighbor algorithm
 * Start from the warehouse (index 0) and always visit the nearest unvisited location
 */
function nearestNeighbor(distanceMatrix, startIndex = 0) {
  const n = distanceMatrix.length;
  const visited = new Set([startIndex]);
  const route = [startIndex];
  let current = startIndex;

  while (visited.size < n) {
    let nearestDist = Infinity;
    let nearestIdx = -1;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && distanceMatrix[current][i] < nearestDist) {
        nearestDist = distanceMatrix[current][i];
        nearestIdx = i;
      }
    }

    if (nearestIdx !== -1) {
      visited.add(nearestIdx);
      route.push(nearestIdx);
      current = nearestIdx;
    }
  }

  // Return to start
  route.push(startIndex);
  return route;
}

/**
 * Calculate total route distance
 */
function routeDistance(route, distanceMatrix) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += distanceMatrix[route[i]][route[i + 1]];
  }
  return total;
}

/**
 * 2-opt improvement: swap edges to find shorter route
 */
function twoOpt(route, distanceMatrix, maxIterations = 100) {
  let improved = true;
  let bestRoute = [...route];
  let bestDistance = routeDistance(bestRoute, distanceMatrix);
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < bestRoute.length - 2; i++) {
      for (let j = i + 1; j < bestRoute.length - 1; j++) {
        // Reverse the segment between i and j
        const newRoute = [
          ...bestRoute.slice(0, i),
          ...bestRoute.slice(i, j + 1).reverse(),
          ...bestRoute.slice(j + 1)
        ];

        const newDistance = routeDistance(newRoute, distanceMatrix);
        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return { route: bestRoute, distance: bestDistance, iterations };
}

/**
 * Generate a naive (sequential) route for comparison
 */
function naiveRoute(locations) {
  return [...Array(locations.length).keys(), 0];
}

/**
 * Main optimization function
 */
export function optimizeRoute(locations) {
  if (!locations || locations.length < 2) {
    return null;
  }

  // Build distance matrix
  const distanceMatrix = buildDistanceMatrix(locations);

  // Naive route (sequential order)
  const naiveOrder = naiveRoute(locations);
  const naiveDistance = routeDistance(naiveOrder, distanceMatrix);

  // Nearest neighbor
  const nnRoute = nearestNeighbor(distanceMatrix, 0);
  const nnDistance = routeDistance(nnRoute, distanceMatrix);

  // 2-opt improvement
  const { route: optimizedRoute, distance: optimizedDistance, iterations } = twoOpt(nnRoute, distanceMatrix);

  // Calculate metrics
  const distanceSaved = naiveDistance - optimizedDistance;
  const percentSaved = ((distanceSaved / naiveDistance) * 100);

  // Estimate fuel and CO2 (assume 12 km/L diesel, 2.68 kg CO2/L)
  const fuelUsedNaive = naiveDistance / 12;
  const fuelUsedOptimized = optimizedDistance / 12;
  const fuelSaved = fuelUsedNaive - fuelUsedOptimized;
  const co2Saved = fuelSaved * 2.68;

  // Estimate time (assume average 30 km/h in city + 5 min per stop)
  const stopsCount = locations.length - 1;
  const timeNaive = (naiveDistance / 30) * 60 + stopsCount * 5;
  const timeOptimized = (optimizedDistance / 30) * 60 + stopsCount * 5;

  return {
    naive: {
      route: naiveOrder.map(i => locations[i]),
      distance: Math.round(naiveDistance * 10) / 10,
      time: Math.round(timeNaive),
      fuel: Math.round(fuelUsedNaive * 100) / 100
    },
    optimized: {
      route: optimizedRoute.map(i => locations[i]),
      distance: Math.round(optimizedDistance * 10) / 10,
      time: Math.round(timeOptimized),
      fuel: Math.round(fuelUsedOptimized * 100) / 100
    },
    savings: {
      distance: Math.round(distanceSaved * 10) / 10,
      distancePercent: Math.round(percentSaved * 10) / 10,
      fuel: Math.round(fuelSaved * 100) / 100,
      co2: Math.round(co2Saved * 100) / 100,
      time: Math.round(timeNaive - timeOptimized)
    },
    metadata: {
      algorithm: 'Nearest Neighbor + 2-opt',
      twoOptIterations: iterations,
      locationsCount: locations.length,
      stopsCount
    }
  };
}

/**
 * Format route for display as ordered list with cumulative distances
 */
export function formatRouteSteps(routeResult) {
  if (!routeResult) return [];

  const steps = [];
  const route = routeResult.optimized.route;

  for (let i = 0; i < route.length; i++) {
    const loc = route[i];
    let distFromPrev = 0;

    if (i > 0) {
      distFromPrev = haversineDistance(
        route[i - 1].lat, route[i - 1].lng,
        loc.lat, loc.lng
      );
    }

    steps.push({
      step: i + 1,
      location: loc,
      distanceFromPrevious: Math.round(distFromPrev * 10) / 10,
      isStart: i === 0,
      isEnd: i === route.length - 1,
      estimatedTime: Math.round((distFromPrev / 30) * 60) + (i > 0 && i < route.length - 1 ? 5 : 0)
    });
  }

  return steps;
}
