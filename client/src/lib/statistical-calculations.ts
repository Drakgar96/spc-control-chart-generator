import { StatisticalResults } from '@/types/spc';

// Normal CDF approximation using error function
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const poly = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * poly;
}

function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

// Anderson-Darling test function - using exact function provided by user
export function andersonDarlingTest(data: number[]): { a2: number | null; pValue: number | null } {
  const n = data.length;
  if (n < 8) {
    // AD test is not reliable for small sample sizes
    return { a2: null, pValue: null };
  }

  const sortedData = [...data].sort((a, b) => a - b);
  const mean = sortedData.reduce((sum, val) => sum + val, 0) / n;
  const stdDev = Math.sqrt(sortedData.map(val => (val - mean) ** 2).reduce((sum, val) => sum + val, 0) / (n - 1));

  if (stdDev === 0) {
    // Cannot perform test on constant data
    return { a2: NaN, pValue: 0 };
  }

  // A simplified normal CDF approximation
  const erf = (x: number) => {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const p = 0.3275911;
    const sign = (x >= 0) ? 1 : -1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const poly = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * poly;
  };
  const simplifiedNormalCDF = (x: number, mu: number, sigma: number) => {
    return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
  };

  let a2 = 0;
  for (let i = 0; i < n; i++) {
    const f_i = simplifiedNormalCDF(sortedData[i], mean, stdDev);
    const term1 = (2 * (i + 1) - 1) * (Math.log(f_i) + Math.log(1 - simplifiedNormalCDF(sortedData[n - 1 - i], mean, stdDev)));
    a2 += term1;
  }
  a2 = -n - (a2 / n);

  // A simplified P-value calculation based on the A^2 statistic
  let pValue = 0;
  const a2Star = a2 * (1 + 4/n - 25/(n*n)); // Adjusted A^2
  if (a2Star >= 1.038) pValue = 0.001;
  else if (a2Star >= 0.916) pValue = 0.005;
  else if (a2Star >= 0.787) pValue = 0.010;
  else if (a2Star >= 0.656) pValue = 0.025;
  else if (a2Star >= 0.569) pValue = 0.050;
  else if (a2Star >= 0.505) pValue = 0.100;
  else pValue = 0.150;
  
  return { a2: a2, pValue: pValue };
}

export function calculateStatistics(data: number[], nominal: number, upperTol: number, lowerTol: number): StatisticalResults {
  if (!data || data.length === 0) {
    throw new Error('No data provided for statistical calculation');
  }

  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  const USL = nominal + upperTol;
  const LSL = nominal + lowerTol;
  const tolerance = USL - LSL;
  
  // Process capability indices
  const Cp = tolerance / (6 * stdDev);
  const Cpk = Math.min((USL - mean) / (3 * stdDev), (mean - LSL) / (3 * stdDev));
  const Pp = tolerance / (6 * stdDev);
  const Ppk = Math.min((USL - mean) / (3 * stdDev), (mean - LSL) / (3 * stdDev));
  
  // Count out-of-spec parts
  const outOfSpecCount = data.filter(val => val > USL || val < LSL).length;
  const observedPPM = (outOfSpecCount / n) * 1000000;
  
  // Estimate PPM from normal distribution
  const zUSL = (USL - mean) / stdDev;
  const zLSL = (LSL - mean) / stdDev;
  const pOutOfSpec = (1 - normalCDF(zUSL)) + normalCDF(zLSL);
  const estimatedPPM = pOutOfSpec * 1000000;

  // Normality test using the provided Anderson-Darling function
  const normalityTest = andersonDarlingTest(data);
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  return {
    n,
    mean,
    stdDev,
    min,
    max,
    range,
    USL,
    LSL,
    tolerance,
    Cp,
    Cpk,
    Pp,
    Ppk,
    observedPPM,
    estimatedPPM,
    outOfSpecCount,
    normalityTest
  };
}

export function generateSampleData(nominal: number, upperTol: number, lowerTol: number, count: number = 30): number[] {
  const sampleData: number[] = [];
  const toleranceRange = upperTol - lowerTol;
  const standardDeviation = toleranceRange / 6; // Assume 6-sigma process

  for (let i = 0; i < count; i++) {
    // Generate normal distribution around nominal
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = nominal + (z0 * standardDeviation);
    sampleData.push(parseFloat(value.toFixed(3)));
  }

  return sampleData;
}
