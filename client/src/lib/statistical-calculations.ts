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

// Normal quantile function (inverse of normal CDF) - needed for Q-Q plots
export function normalQuantile(p: number): number {
  // Beasley-Springer-Moro algorithm
  if (p <= 0 || p >= 1) {
    throw new Error('Input must be between 0 and 1');
  }
  
  const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;
  
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q / (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) / ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
  }
}

// Normal PDF function - needed for distribution plots
export function normalPDF(x: number, mean: number, stdDev: number): number {
  const variance = stdDev * stdDev;
  const denominator = Math.sqrt(2 * Math.PI * variance);
  const exponent = -((x - mean) * (x - mean)) / (2 * variance);
  return Math.exp(exponent) / denominator;
}

// Control chart constants lookup table
export const CONSTANTS: Record<number, { A2: number; D3: number; D4: number; d2: number }> = {
  2: { A2: 1.880, D3: 0, D4: 3.267, d2: 1.128 },
  3: { A2: 1.023, D3: 0, D4: 2.574, d2: 1.693 },
  4: { A2: 0.729, D3: 0, D4: 2.282, d2: 2.059 },
  5: { A2: 0.577, D3: 0, D4: 2.114, d2: 2.326 },
  6: { A2: 0.483, D3: 0, D4: 2.004, d2: 2.534 },
  7: { A2: 0.419, D3: 0.076, D4: 1.924, d2: 2.704 },
  8: { A2: 0.373, D3: 0.136, D4: 1.864, d2: 2.847 },
  9: { A2: 0.337, D3: 0.184, D4: 1.816, d2: 2.970 },
  10: { A2: 0.308, D3: 0.223, D4: 1.777, d2: 3.078 },
};

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

// Parse variable data from text input for subgrouping
export function parseVariableData(dataText: string): number[][] {
  const lines = dataText.split('\n').filter(line => line.trim());
  const subgroups: number[][] = [];
  
  lines.forEach(line => {
    const values = line.split(',').map(val => {
      const num = parseFloat(val.trim());
      return isNaN(num) ? null : num;
    }).filter(val => val !== null) as number[];
    
    if (values.length > 0) {
      subgroups.push(values);
    }
  });
  
  return subgroups;
}

// Parse attribute data from text input
export function parseAttributeData(dataText: string): { sampleSize: number; defectCount: number }[] {
  const lines = dataText.split('\n').filter(line => line.trim());
  const attributeData: { sampleSize: number; defectCount: number }[] = [];
  
  lines.forEach(line => {
    const parts = line.split(',').map(val => val.trim());
    if (parts.length >= 2) {
      const sampleSize = parseInt(parts[0]);
      const defectCount = parseInt(parts[1]);
      
      if (!isNaN(sampleSize) && !isNaN(defectCount) && sampleSize > 0) {
        attributeData.push({ sampleSize, defectCount });
      }
    }
  });
  
  return attributeData;
}

// Calculate SPC statistics for variable data with subgroups
export function calculateSPCStats(subgroups: number[][], subgroupSize: number) {
  // Calculate subgroup means and ranges
  const xBars = subgroups.map(subgroup => 
    subgroup.reduce((sum, val) => sum + val, 0) / subgroup.length
  );
  
  const ranges = subgroups.map(subgroup => {
    const min = Math.min(...subgroup);
    const max = Math.max(...subgroup);
    return max - min;
  });
  
  // Calculate overall mean (X double bar) and average range (R bar)
  const xDoubleBar = xBars.reduce((sum, val) => sum + val, 0) / xBars.length;
  const rBar = ranges.reduce((sum, val) => sum + val, 0) / ranges.length;
  
  // Control chart constants
  const n = Math.min(Math.max(subgroupSize, 2), 10);
  const A2 = CONSTANTS[n].A2;
  const D3 = CONSTANTS[n].D3;
  const D4 = CONSTANTS[n].D4;
  const d2 = CONSTANTS[n].d2;
  
  // Calculate control limits
  const xBarUCL = xDoubleBar + A2 * rBar;
  const xBarLCL = xDoubleBar - A2 * rBar;
  const rUCL = D4 * rBar;
  const rLCL = D3 * rBar;
  
  // Detect out-of-control points
  const outOfControlX: number[] = [];
  const outOfControlR: number[] = [];
  
  xBars.forEach((xBar, index) => {
    if (xBar > xBarUCL || xBar < xBarLCL) {
      outOfControlX.push(index);
    }
  });
  
  ranges.forEach((range, index) => {
    if (range > rUCL || range < rLCL) {
      outOfControlR.push(index);
    }
  });
  
  return {
    xBars,
    ranges,
    xDoubleBar,
    rBar,
    xBarUCL,
    xBarLCL,
    rUCL,
    rLCL,
    outOfControlX,
    outOfControlR,
    A2,
    d2
  };
}

// Calculate within-subgroup standard deviation
export function calculateSigmaWithin(subgroups: number[][]): number | null {
  let totalSumSquares = 0;
  let totalCount = 0;

  subgroups.forEach(subgroup => {
    if (subgroup.length > 1) {
      const mean = subgroup.reduce((sum, val) => sum + val, 0) / subgroup.length;
      const sumSquares = subgroup.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
      totalSumSquares += sumSquares;
      totalCount += subgroup.length;
    }
  });

  if (totalCount <= subgroups.length) return null;

  return Math.sqrt(totalSumSquares / (totalCount - subgroups.length));
}

// Calculate p-chart statistics for attribute data
export function calculatePChartStats(attributeData: { sampleSize: number; defectCount: number }[]) {
  const subgroupSizes = attributeData.map(d => d.sampleSize);
  const nonConformingCounts = attributeData.map(d => d.defectCount);
  const proportions = attributeData.map(d => d.defectCount / d.sampleSize);
  
  // Calculate p-bar (overall proportion)
  const totalDefects = nonConformingCounts.reduce((sum, val) => sum + val, 0);
  const totalSample = subgroupSizes.reduce((sum, val) => sum + val, 0);
  const pBar = totalDefects / totalSample;
  
  // Calculate dynamic control limits for each subgroup
  const ucl = subgroupSizes.map(n => {
    const limit = pBar + 3 * Math.sqrt((pBar * (1 - pBar)) / n);
    return Math.min(limit, 1); // Cap at 1
  });
  
  const lcl = subgroupSizes.map(n => {
    const limit = pBar - 3 * Math.sqrt((pBar * (1 - pBar)) / n);
    return Math.max(limit, 0); // Floor at 0
  });
  
  // Detect out-of-control points
  const outOfControl: number[] = [];
  proportions.forEach((p, index) => {
    if (p > ucl[index] || p < lcl[index]) {
      outOfControl.push(index);
    }
  });
  
  return { proportions, pBar, ucl, lcl, outOfControl };
}

export function calculateStatistics(data: number[], nominal: number, upperTol: number, lowerTol: number, sigmaWithin?: number | null): StatisticalResults {
  if (!data || data.length === 0) {
    throw new Error('No data provided for statistical calculation');
  }

  const n = data.length;
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  
  // Convert tolerance to specification limits
  // upperTol and lowerTol are the tolerance deviations from nominal
  const USL = nominal + upperTol;
  const LSL = nominal - Math.abs(lowerTol); // Ensure LSL is below nominal
  const tolerance = USL - LSL;
  
  // Process capability indices
  // Cp and Cpk use sigma within (short-term capability) when available
  const sigmaForCp = sigmaWithin || stdDev;
  const Cp = tolerance / (6 * sigmaForCp);
  const Cpk = Math.min((USL - mean) / (3 * sigmaForCp), (mean - LSL) / (3 * sigmaForCp));
  
  // Pp and Ppk use overall sigma (long-term capability)
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
