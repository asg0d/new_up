import { calculateLinearRegression, calculateRSquared } from './utils';

export const calculate = (data, options = {}) => {
  // First pass: calculate x, y values
  const results = data.map(row => {
    const x = parseFloat(row.liquid) || 0;  // X = Vж (liquid volume)
    const oil = parseFloat(row.oil) || 0;
    const liquid = parseFloat(row.liquid) || 0;
    const y = oil * liquid;  // Y = Vн * Vж (oil volume * liquid volume)
    const xy = x * y;
    const x2 = x * x;
    
    return {
      year: row.year,
      x,
      y,
      xy,
      x2,
      method: 'Камбаров',
      xDescription: 'V воды',
      yDescription: 'V жидкости / V нефти'
    };
  });

  // Calculate sums for regression coefficients
  const sumX = results.reduce((sum, p) => sum + p.x, 0);
  const sumY = results.reduce((sum, p) => sum + p.y, 0);
  const sumXY = results.reduce((sum, p) => sum + p.xy, 0);
  const sumX2 = results.reduce((sum, p) => sum + p.x2, 0);

  // B = (N * ∑xiyi - ∑xi * ∑yi) / (N * ∑xi² - ∑xi * ∑xi)
  const numeratorB = data.length * sumXY - sumX * sumY;
  const denominatorB = data.length * sumX2 - sumX * sumX;
  const B = denominatorB !== 0 ? numeratorB / denominatorB : 0;

  // A = (∑yi - B * ∑xi) / N
  const A = (sumY - B * sumX) / data.length;

  // Calculate R²
  const yMean = sumY / data.length;
  const ssTotal = results.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = results.reduce((sum, p) => {
    const yPredicted = A + B * p.x;  // Note: Order is A + Bx for prediction
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
    sums: {
      sumX,
      sumY,
      sumXY,
      sumX2,
      sumXSquared: sumX * sumX
    },
    method: 'Камбаров',
    xDescription: 'V воды',
    yDescription: 'V жидкости / V нефти'
  };
};
