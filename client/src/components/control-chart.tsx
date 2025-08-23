import { useEffect, useRef } from 'react';
import { Characteristic } from '@/types/spc';
import { normalQuantile, normalPDF } from '@/lib/statistical-calculations';

declare global {
  interface Window {
    Chart: any;
  }
}

interface ControlChartProps {
  characteristic: Characteristic;
}

export default function ControlChart({ characteristic }: ControlChartProps) {
  const xBarChartRef = useRef<HTMLCanvasElement>(null);
  const rChartRef = useRef<HTMLCanvasElement>(null);
  const qqPlotRef = useRef<HTMLCanvasElement>(null);
  const distributionRef = useRef<HTMLCanvasElement>(null);
  const pChartRef = useRef<HTMLCanvasElement>(null);
  
  const chartInstances = useRef<Record<string, any>>({});

  useEffect(() => {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => createCharts();
      document.head.appendChild(script);
    } else {
      createCharts();
    }

    return () => {
      // Cleanup all chart instances
      Object.values(chartInstances.current).forEach((chart: any) => {
        if (chart) chart.destroy();
      });
      chartInstances.current = {};
    };
  }, [characteristic]);

  const createCharts = () => {
    if (!window.Chart) return;

    // Destroy existing charts
    Object.values(chartInstances.current).forEach((chart: any) => {
      if (chart) chart.destroy();
    });
    chartInstances.current = {};

    if (characteristic.type === 'variable' && characteristic.spcStats) {
      createXBarChart();
      createRChart();
      createQQPlot();
      createDistributionChart();
    } else if (characteristic.type === 'attribute' && characteristic.pChartStats) {
      createPChart();
    }
  };

  const createXBarChart = () => {
    if (!xBarChartRef.current || !characteristic.spcStats) return;

    const ctx = xBarChartRef.current.getContext('2d');
    if (!ctx) return;

    const { xBars, xDoubleBar, xBarUCL, xBarLCL, outOfControlX } = characteristic.spcStats;
    const labels = xBars.map((_, index) => (index + 1).toString());
    const { stats } = characteristic;
    
    // Determine point colors: Red for spec limit violations, Orange for control limit violations
    const pointColors = xBars.map((value, index) => {
      if (outOfControlX.includes(index)) {
        // Check if it's outside spec limits (USL/LSL) - RED
        if ((stats?.USL && value > stats.USL) || (stats?.LSL && value < stats.LSL)) {
          return 'rgb(239, 68, 68)'; // Red for spec violations
        }
        // Otherwise it's outside control limits (UCL/LCL) - ORANGE
        return 'rgb(255, 165, 0)'; // Orange for control limit violations
      }
      return 'rgb(59, 130, 246)'; // Blue for normal points
    });

    const datasets = [{
      label: 'X-bar (Subgroup Means)',
      data: xBars,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: pointColors,
      pointBorderColor: pointColors,
      tension: 0.2,
      pointRadius: 4,
      fill: false
    }, {
      label: `CL (${xDoubleBar.toFixed(3)})`,
      data: Array(xBars.length).fill(xDoubleBar),
      borderColor: 'rgb(34, 197, 94)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: `UCL (${xBarUCL.toFixed(3)})`,
      data: Array(xBars.length).fill(xBarUCL),
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: `LCL (${xBarLCL.toFixed(3)})`,
      data: Array(xBars.length).fill(xBarLCL),
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }];

    // Add specification limits if available
    if (stats?.USL) {
      datasets.push({
        label: `USL (${stats.USL.toFixed(3)})`,
        data: Array(xBars.length).fill(stats.USL),
        borderColor: 'rgb(124, 58, 237)',
        borderDash: [],
        pointRadius: 0,
        tension: 0,
        fill: false
      });
    }

    if (stats?.LSL) {
      datasets.push({
        label: `LSL (${stats.LSL.toFixed(3)})`,
        data: Array(xBars.length).fill(stats.LSL),
        borderColor: 'rgb(20, 184, 166)',
        borderDash: [],
        pointRadius: 0,
        tension: 0,
        fill: false
      });
    }

    if (characteristic.nominal) {
      datasets.push({
        label: `Nominal (${characteristic.nominal.toFixed(3)})`,
        data: Array(xBars.length).fill(characteristic.nominal),
        borderColor: 'rgb(0, 0, 0)',
        borderDash: [3, 2],
        pointRadius: 0,
        tension: 0,
        fill: false
      });
    }

    chartInstances.current['xbar'] = new window.Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'X-bar Chart' },
          legend: { position: 'bottom' }
        },
        scales: {
          y: { 
            beginAtZero: false,
            title: { display: true, text: 'Value' }
          },
          x: { 
            title: { display: true, text: 'Subgroup Number' }
          }
        }
      }
    });
  };

  const createRChart = () => {
    if (!rChartRef.current || !characteristic.spcStats) return;

    const ctx = rChartRef.current.getContext('2d');
    if (!ctx) return;

    const { ranges, rBar, rUCL, rLCL, outOfControlR } = characteristic.spcStats;
    const labels = ranges.map((_, index) => (index + 1).toString());

    const pointColors = ranges.map((_, index) => 
      outOfControlR.includes(index) ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'
    );

    const datasets = [{
      label: 'Range',
      data: ranges,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: pointColors,
      pointBorderColor: pointColors,
      tension: 0.2,
      pointRadius: 4,
      fill: false
    }, {
      label: `CL (${rBar.toFixed(3)})`,
      data: Array(ranges.length).fill(rBar),
      borderColor: 'rgb(34, 197, 94)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: `UCL (${rUCL.toFixed(3)})`,
      data: Array(ranges.length).fill(rUCL),
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: `LCL (${rLCL.toFixed(3)})`,
      data: Array(ranges.length).fill(rLCL),
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }];

    chartInstances.current['r'] = new window.Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'R Chart' },
          legend: { position: 'bottom' }
        },
        scales: {
          y: { 
            beginAtZero: true,
            title: { display: true, text: 'Range' }
          },
          x: { 
            title: { display: true, text: 'Subgroup Number' }
          }
        }
      }
    });
  };

  const createQQPlot = () => {
    if (!qqPlotRef.current || !characteristic.spcStats) return;

    const ctx = qqPlotRef.current.getContext('2d');
    if (!ctx) return;

    const { allDataPoints } = characteristic.spcStats;
    const n = allDataPoints.length;
    const sortedData = [...allDataPoints].sort((a, b) => a - b);

    // Generate theoretical quantiles
    const qqData = [];
    for (let i = 0; i < n; i++) {
      const p = (i + 1 - 0.5) / n; // Probability
      const theoreticalQuantile = normalQuantile(p);
      qqData.push({ x: theoreticalQuantile, y: sortedData[i] });
    }

    // Calculate correlation coefficient for R²
    const meanTheorical = qqData.reduce((sum, p) => sum + p.x, 0) / n;
    const meanSample = qqData.reduce((sum, p) => sum + p.y, 0) / n;
    
    let numerator = 0;
    let sumTheoreticalSq = 0;
    let sumSampleSq = 0;
    
    qqData.forEach(p => {
      const diffTheorical = p.x - meanTheorical;
      const diffSample = p.y - meanSample;
      numerator += diffTheorical * diffSample;
      sumTheoreticalSq += diffTheorical * diffTheorical;
      sumSampleSq += diffSample * diffSample;
    });
    
    const r = numerator / Math.sqrt(sumTheoreticalSq * sumSampleSq);
    const rSquared = r * r;

    // Calculate Q-Q line
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1_data = sortedData[q1Index];
    const q3_data = sortedData[q3Index];
    const q1_theoretical = normalQuantile((q1Index + 1 - 0.5) / n);
    const q3_theoretical = normalQuantile((q3Index + 1 - 0.5) / n);

    const slope = (q3_data - q1_data) / (q3_theoretical - q1_theoretical);
    const intercept = q1_data - slope * q1_theoretical;

    const minX = Math.min(...qqData.map(p => p.x));
    const maxX = Math.max(...qqData.map(p => p.x));
    
    const qqLineData = [
      { x: minX, y: intercept + slope * minX },
      { x: maxX, y: intercept + slope * maxX }
    ];
    
    const datasets = [{
      label: 'Data Quantiles',
      data: qqData,
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'rgb(59, 130, 246)',
      pointRadius: 5,
      type: 'scatter',
    }, {
      label: 'Q-Q Line',
      data: qqLineData,
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      type: 'line',
      fill: false,
    }];

    chartInstances.current['qq'] = new window.Chart(ctx, {
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { intersect: false },
        scales: {
          x: { title: { display: true, text: 'Theoretical Quantiles' } },
          y: { title: { display: true, text: 'Sample Quantiles' } }
        },
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Normal Q-Q Plot' },
          subtitle: {
            display: true,
            text: `Coefficient of Determination (R²): ${rSquared.toFixed(4)}`,
            color: '#4B5563',
            font: { size: 14, weight: 'normal' },
            padding: { top: 5, bottom: 0 }
          }
        }
      }
    });
  };

  const createDistributionChart = () => {
    if (!distributionRef.current || !characteristic.spcStats || !characteristic.stats) return;

    const ctx = distributionRef.current.getContext('2d');
    if (!ctx) return;

    const { allDataPoints } = characteristic.spcStats;
    const { mean, stdDev } = characteristic.stats;

    // Generate theoretical normal curve
    const minData = Math.min(...allDataPoints);
    const maxData = Math.max(...allDataPoints);
    const range = maxData - minData;
    const step = range / 100;
    const curveData: number[] = [];
    const curveLabels: string[] = [];
    
    for (let x = minData - range * 0.1; x <= maxData + range * 0.1; x += step) {
      curveLabels.push(x.toFixed(2));
      curveData.push(normalPDF(x, mean, stdDev));
    }

    // Create histogram of actual data
    const binSize = (maxData - minData) / 10;
    const histogramData: { x: number; y: number }[] = [];
    const histogramLabels: string[] = [];
    const bins: Record<string, number> = {};
    
    for (let i = minData; i <= maxData + binSize; i += binSize) {
      const binLabel = `${i.toFixed(2)}`;
      histogramLabels.push(binLabel);
      bins[binLabel] = 0;
    }
    
    allDataPoints.forEach(val => {
      const binIndex = Math.floor((val - minData) / binSize);
      const binLabel = histogramLabels[binIndex];
      if (binLabel) {
        bins[binLabel]++;
      }
    });
    
    for (const key in bins) {
      const binCenter = parseFloat(key);
      const count = bins[key];
      const density = count / (allDataPoints.length * binSize);
      histogramData.push({ x: binCenter, y: density });
    }

    const datasets = [{
      label: 'Actual Data (Histogram)',
      data: histogramData,
      type: 'bar',
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
      barPercentage: 0.9,
      categoryPercentage: 0.9,
    }, {
      label: 'Normal Distribution Fit',
      data: curveLabels.map((x, i) => ({ x: parseFloat(x), y: curveData[i] })),
      type: 'line',
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: false,
      pointRadius: 0,
      tension: 0.4,
    }];

    chartInstances.current['distribution'] = new window.Chart(ctx, {
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { 
            type: 'linear',
            title: { display: true, text: 'Value' }
          },
          y: { title: { display: true, text: 'Density' } }
        },
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'Distribution Plot' }
        }
      }
    });
  };

  const createPChart = () => {
    if (!pChartRef.current || !characteristic.pChartStats) return;

    const ctx = pChartRef.current.getContext('2d');
    if (!ctx) return;

    const { proportions, pBar, ucl, lcl, outOfControl } = characteristic.pChartStats;
    const labels = proportions.map((_, index) => (index + 1).toString());

    const pointColors = proportions.map((_, index) => 
      outOfControl.includes(index) ? 'red' : 'rgb(59, 130, 246)'
    );

    const datasets = [{
      label: 'Proportion of Non-Conforming (p)',
      data: proportions,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgb(59, 130, 246)',
      tension: 0.2,
      pointRadius: 5,
      pointBackgroundColor: pointColors,
      pointBorderColor: pointColors,
      fill: false,
    }, {
      label: `CL (${pBar.toFixed(3)})`,
      data: Array(proportions.length).fill(pBar),
      borderColor: 'rgb(34, 197, 94)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: 'UCL',
      data: ucl,
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }, {
      label: 'LCL',
      data: lcl,
      borderColor: 'rgb(239, 68, 68)',
      borderDash: [5, 5],
      pointRadius: 0,
      tension: 0,
      fill: false
    }];

    chartInstances.current['p'] = new window.Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            title: { display: true, text: 'Proportion' }
          },
          x: { 
            title: { display: true, text: 'Subgroup Number' }
          }
        },
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'p Chart' }
        }
      }
    });
  };

  if (!characteristic.stats && !characteristic.pChartStats) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm keep-together">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800" data-testid={`text-chart-title-${characteristic.id}`}>
          {characteristic.name} - {characteristic.type === 'variable' ? 'Variable' : 'Attribute'} Characteristic
        </h3>
        <span className="text-sm text-gray-500" data-testid={`text-sample-count-${characteristic.id}`}>
          {characteristic.type === 'variable' ? 
            `${characteristic.subgroups?.length || 0} subgroups` : 
            `${characteristic.attributeData?.length || 0} samples`}
        </span>
      </div>
      
      {characteristic.type === 'variable' && characteristic.spcStats && (
        <div className="space-y-6">
          {/* X-bar Chart */}
          <div className="chart-container">
            <canvas ref={xBarChartRef} data-testid={`canvas-xbar-chart-${characteristic.id}`}></canvas>
          </div>
          
          {/* R Chart */}
          <div className="chart-container">
            <canvas ref={rChartRef} data-testid={`canvas-r-chart-${characteristic.id}`}></canvas>
          </div>
          
          {/* Q-Q Plot */}
          <div className="chart-container">
            <canvas ref={qqPlotRef} data-testid={`canvas-qq-plot-${characteristic.id}`}></canvas>
          </div>
          
          {/* Distribution Chart */}
          <div className="chart-container">
            <canvas ref={distributionRef} data-testid={`canvas-distribution-${characteristic.id}`}></canvas>
          </div>
          
          {/* Statistical Summary for Variable */}
          {characteristic.stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">X̄ (Process Mean)</div>
                <div className="text-gray-800" data-testid={`text-process-mean-${characteristic.id}`}>
                  {characteristic.spcStats.xDoubleBar.toFixed(3)} {characteristic.unit}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">R̄ (Avg Range)</div>
                <div className="text-gray-800" data-testid={`text-avg-range-${characteristic.id}`}>
                  {characteristic.spcStats.rBar.toFixed(3)} {characteristic.unit}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">Cp (Short-term)</div>
                <div className="text-gray-800" data-testid={`text-cp-${characteristic.id}`}>
                  {characteristic.stats.Cp?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">Cpk (Short-term)</div>
                <div className="text-gray-800" data-testid={`text-cpk-${characteristic.id}`}>
                  {characteristic.stats.Cpk?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">Pp (Long-term)</div>
                <div className="text-gray-800" data-testid={`text-pp-${characteristic.id}`}>
                  {characteristic.stats.Pp?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="font-semibold text-gray-600">Ppk (Long-term)</div>
                <div className="text-gray-800" data-testid={`text-ppk-${characteristic.id}`}>
                  {characteristic.stats.Ppk?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-600">Out of Control (X̄)</div>
                <div className="text-blue-800" data-testid={`text-out-of-control-x-${characteristic.id}`}>
                  {characteristic.spcStats.outOfControlX.length}
                </div>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-600">Out of Control (R)</div>
                <div className="text-blue-800" data-testid={`text-out-of-control-r-${characteristic.id}`}>
                  {characteristic.spcStats.outOfControlR.length}
                </div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="font-semibold text-yellow-600">AD Statistic</div>
                <div className="text-yellow-800" data-testid={`text-ad-statistic-${characteristic.id}`}>
                  {characteristic.stats.normalityTest.a2?.toFixed(3) || 'N/A'}
                </div>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <div className="font-semibold text-yellow-600">AD p-value</div>
                <div className="text-yellow-800" data-testid={`text-ad-pvalue-${characteristic.id}`}>
                  {characteristic.stats.normalityTest.pValue?.toFixed(3) || 'N/A'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {characteristic.type === 'attribute' && characteristic.pChartStats && (
        <div className="space-y-6">
          {/* P Chart */}
          <div className="chart-container">
            <canvas ref={pChartRef} data-testid={`canvas-p-chart-${characteristic.id}`}></canvas>
          </div>
          
          {/* Statistical Summary for Attribute */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <div className="font-semibold text-gray-600">p̄ (Average Proportion)</div>
              <div className="text-gray-800" data-testid={`text-p-bar-${characteristic.id}`}>
                {characteristic.pChartStats.pBar.toFixed(4)}
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-semibold text-blue-600">Out of Control</div>
              <div className="text-blue-800" data-testid={`text-out-of-control-${characteristic.id}`}>
                {characteristic.pChartStats.outOfControl.length}
              </div>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <div className="font-semibold text-red-600">PPM (Estimated)</div>
              <div className="text-red-800" data-testid={`text-estimated-ppm-${characteristic.id}`}>
                {Math.round(characteristic.pChartStats.pBar * 1000000)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}