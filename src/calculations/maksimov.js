import { calculateLinearRegression, calculateRSquared } from './utils';

/**
 * Calculates the Maximov method results.
 *
 * @param {Array} data - Input data.
 * @param {Object} options - Optional parameters.
 * @returns {Object} Results of the calculation.
 */
export const calculate = (data, options = {}) => {
  // First pass: calculate x, y values
  const results = data.map(row => {
    const x = parseFloat(row.oil) || 0;  // X = Vн (oil volume)
    const water = parseFloat(row.water) || 0;
    const y = water > 0 ? Math.log(water) : 0;  // Y = ln(Vв) (natural log of water volume)
    
    return {
      year: row.year,
      x,
      y,
      xy: x * y,
      x2: x * x,
      method: 'Максимов',
      xDescription: 'V нефти',
      yDescription: 'ln(V воды)'
    };
  });

  // Calculate regression coefficients directly
  const N = results.length;
  const sumX = results.reduce((sum, p) => sum + p.x, 0);
  const sumY = results.reduce((sum, p) => sum + p.y, 0);
  const sumXY = results.reduce((sum, p) => sum + p.xy, 0);
  const sumX2 = results.reduce((sum, p) => sum + p.x2, 0);

  // A = (N * ∑xiyi - ∑xi * ∑yi) / (N * ∑xi² - ∑xi * ∑xi)
  const numeratorA = N * sumXY - sumX * sumY;
  const denominatorA = N * sumX2 - sumX * sumX;
  const A = denominatorA !== 0 ? numeratorA / denominatorA : 0;

  // B = (∑yi - A * ∑xi) / N
  const B = (sumY - A * sumX) / N;

  // Calculate R²
  const yMean = sumY / N;
  const ssTotal = results.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = results.reduce((sum, p) => {
    const yPredicted = A * p.x + B;
    return sum + Math.pow(p.y - yPredicted, 2);
  }, 0);
  const R2 = 1 - (ssResidual / ssTotal);

  return {
    results,
    coefficients: {
      A,
      B,
      R2
    },
    method: 'Максимов',
    xDescription: 'V нефти',
    yDescription: 'ln(V воды)'
  };
};
