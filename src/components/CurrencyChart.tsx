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

// Rejestracja niezbędnych komponentów Chart.js (wymagane w nowszych wersjach)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CurrencyChart {
  fromCurrency: string;
  toCurrency: string
}

function CurrencyChart({fromCurrency,toCurrency} : CurrencyChart) {

const [chartData, setChartData] = useState<{labels: string[], values: number[], movingAvg: (number | null)[]}>({ labels: [], values: [], movingAvg: [] });
  const [isFetching, setIsFetching] = useState<boolean>(false);

 const calculateMovingAverage = (values: number[], windowSize: number): (number | null)[] => {
    return values.map((_, index, arr) => {
    if (index < windowSize - 1) return null;
    const window = arr.slice(index - windowSize + 1, index + 1);
    const sum = window.reduce((acc, val) => acc + val, 0);
    return sum / windowSize;
    });
 }
  useEffect(() => {
    if (!fromCurrency || !toCurrency ) return;
    setIsFetching(true);
    const fetchHistoricalData = async () => {
      try {
        const data = await currencyApi.historicaldata(fromCurrency,toCurrency);
        const entries = Object.entries(data.rates);
        const labels = entries.map(([date,_]) => date);
        const values = entries.map(([_,rateObj]) => (rateObj as Record<string, number>)[toCurrency]);
          
        const movingAvg = calculateMovingAverage(values, 7); 
        setChartData({ labels, values,movingAvg});
      }
      catch (err) {
        console.log(err);
      } finally {
        setIsFetching(false);
      }
    }
    fetchHistoricalData();
  }, [fromCurrency,toCurrency]);

return (
  <>
    {isFetching ? (
      <p>Loading chart...</p>
    ) : chartData.labels.length > 0 ? (
      <Line 
        data={{
          labels: chartData.labels,
          datasets: [{
            label: `Kurs ${fromCurrency}/${toCurrency}`,
            data: chartData.values,
            borderColor: 'rgb(75, 192, 192)',
          },
      {
        label: `Średnia ruchoma (7 dni)`,
        data: chartData.movingAvg,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderDash: [5, 5],
        pointRadius: 2,
      }]
        }} 
      />
    ) : (
      <p>Failed to fetch chart data</p>
    )}
  </>
);
  
}

export default CurrencyChart;