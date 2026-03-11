import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { currencyApi } from '../services/api';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CurrencyChartProps {
  fromCurrency: string;
  toCurrency: string;
}

function CurrencyChart({ fromCurrency, toCurrency }: CurrencyChartProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    values: number[];
    movingAvg: (number | null)[];
  }>({ labels: [], values: [], movingAvg: [] });
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const calculateMovingAverage = (values: number[], windowSize: number): (number | null)[] => {
    return values.map((_, index, arr) => {
      if (index < windowSize - 1) return null;
      const window = arr.slice(index - windowSize + 1, index + 1);
      return window.reduce((acc, val) => acc + val, 0) / windowSize;
    });
  };

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;
    setIsFetching(true);
    const fetchHistoricalData = async () => {
      try {
        const data = await currencyApi.historicaldata(fromCurrency, toCurrency);
        const entries = Object.entries(data.rates);
        const labels = entries.map(([date]) => date);
        const values = entries.map(([, rateObj]) => (rateObj as Record<string, number>)[toCurrency]);
        const movingAvg = calculateMovingAverage(values, 7);
        setChartData({ labels, values, movingAvg });
      } catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchHistoricalData();
  }, [fromCurrency, toCurrency]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6b7280',
          font: { size: 11, family: 'monospace' },
          boxWidth: 20,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#9ca3af',
        bodyColor: '#e5e7eb',
        titleFont: { family: 'monospace', size: 11 },
        bodyFont: { family: 'monospace', size: 12 },
        padding: 10,
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(5) ?? 'N/A'}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#4b5563',
          font: { size: 10, family: 'monospace' },
          maxRotation: 45,
          maxTicksLimit: 10,
        },
        grid: { color: '#1f2937' },
        border: { color: '#374151' },
      },
      y: {
        ticks: {
          color: '#4b5563',
          font: { size: 10, family: 'monospace' },
          callback: (value: any) => value.toFixed(4),
        },
        grid: { color: '#1f2937' },
        border: { color: '#374151' },
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chart header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400">
            {fromCurrency} <span className="text-indigo-500">/</span> {toCurrency}
          </h2>
          <p className="text-xs text-gray-600 mt-0.5 tracking-wide">6-month historical rate</p>
        </div>
        {!isFetching && chartData.values.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-600 tracking-wide">Latest</p>
            <p className="text-sm font-semibold text-indigo-400 tabular-nums">
              {chartData.values[chartData.values.length - 1]?.toFixed(5)}
            </p>
          </div>
        )}
      </div>

      {/* Chart body */}
      {isFetching ? (
        <div className="flex-1 flex items-center justify-center gap-2 text-gray-600 text-sm">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      ) : chartData.labels.length > 0 ? (
        <div className="flex-1 min-h-0">
          <Line
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: `${fromCurrency}/${toCurrency}`,
                  data: chartData.values,
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  borderWidth: 1.5,
                  pointRadius: 0,
                  pointHoverRadius: 4,
                  pointHoverBackgroundColor: '#6366f1',
                  tension: 0.3,
                  fill: true,
                },
                {
                  label: '7-day avg',
                  data: chartData.movingAvg,
                  borderColor: '#f59e0b',
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderDash: [4, 4],
                  pointRadius: 0,
                  pointHoverRadius: 3,
                  tension: 0.3,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
          No chart data available
        </div>
      )}
    </div>
  );
}

export default CurrencyChart;
