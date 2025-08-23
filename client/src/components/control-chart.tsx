import { useEffect, useRef } from 'react';
import { Characteristic } from '@/types/spc';

declare global {
  interface Window {
    Chart: any;
  }
}

interface ControlChartProps {
  characteristic: Characteristic;
}

export default function ControlChart({ characteristic }: ControlChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Load Chart.js if not already loaded
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => createChart();
      document.head.appendChild(script);
    } else {
      createChart();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [characteristic]);

  const createChart = () => {
    if (!canvasRef.current || !characteristic.stats || !window.Chart) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = characteristic.data.map((_, index) => index + 1);
    const UCL = characteristic.stats.mean + (3 * characteristic.stats.stdDev);
    const LCL = characteristic.stats.mean - (3 * characteristic.stats.stdDev);

    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Measurements',
          data: characteristic.data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }, {
          label: 'USL',
          data: Array(characteristic.data.length).fill(characteristic.stats.USL),
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }, {
          label: 'LSL',
          data: Array(characteristic.data.length).fill(characteristic.stats.LSL),
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }, {
          label: 'Nominal',
          data: Array(characteristic.data.length).fill(characteristic.nominal),
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          borderDash: [10, 5],
          pointRadius: 0,
          fill: false
        }, {
          label: 'UCL',
          data: Array(characteristic.data.length).fill(UCL),
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false
        }, {
          label: 'LCL',
          data: Array(characteristic.data.length).fill(LCL),
          borderColor: 'rgb(249, 115, 22)',
          borderWidth: 1,
          borderDash: [3, 3],
          pointRadius: 0,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${characteristic.name} Control Chart`,
            font: { size: 14, weight: 'bold' }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 10 } }
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: `Value (${characteristic.unit})`,
              font: { size: 12 }
            },
            grid: { color: 'rgba(0,0,0,0.1)' }
          },
          x: {
            title: {
              display: true,
              text: 'Sample Number',
              font: { size: 12 }
            },
            grid: { color: 'rgba(0,0,0,0.1)' }
          }
        }
      }
    });
  };

  if (!characteristic.stats) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm keep-together">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800" data-testid={`text-chart-title-${characteristic.id}`}>
          {characteristic.name}
        </h3>
        <span className="text-sm text-gray-500" data-testid={`text-sample-count-${characteristic.id}`}>
          n = {characteristic.data.length}
        </span>
      </div>
      <div className="chart-container mb-4">
        <canvas ref={canvasRef} data-testid={`canvas-chart-${characteristic.id}`}></canvas>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-semibold text-gray-600">Mean</div>
          <div className="text-gray-800" data-testid={`text-mean-${characteristic.id}`}>
            {characteristic.stats.mean.toFixed(3)} {characteristic.unit}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-semibold text-gray-600">Std Dev</div>
          <div className="text-gray-800" data-testid={`text-stddev-${characteristic.id}`}>
            {characteristic.stats.stdDev.toFixed(3)} {characteristic.unit}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-semibold text-gray-600">Cp</div>
          <div className="text-gray-800" data-testid={`text-cp-${characteristic.id}`}>
            {characteristic.stats.Cp.toFixed(3)}
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-semibold text-gray-600">Cpk</div>
          <div className="text-gray-800" data-testid={`text-cpk-${characteristic.id}`}>
            {characteristic.stats.Cpk.toFixed(3)}
          </div>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-600">Estimate PPM</div>
          <div className="text-blue-800" data-testid={`text-estimate-ppm-${characteristic.id}`}>
            {characteristic.stats.estimatedPPM.toFixed(0)}
          </div>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-600">Observed PPM</div>
          <div className="text-blue-800" data-testid={`text-observed-ppm-${characteristic.id}`}>
            {characteristic.stats.observedPPM.toFixed(0)}
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
    </div>
  );
}
