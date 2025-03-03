import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ResultsBarChart = ({ results }) => {
  const validResults = results.filter(result => result.remainingOilReserves !== null);
  const averageValue = validResults.length > 0 
    ? validResults.reduce((sum, r) => sum + r.remainingOilReserves, 0) / 4 
    : null;

  const labels = validResults.map(result => result.method);
  
  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'V остаточные',
        data: validResults.map(result => result.remainingOilReserves),
        backgroundColor: 'rgba(25, 118, 210, 0.6)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
      {
        type: 'line',
        label: 'V среднее',
        data: Array(labels.length).fill(averageValue),
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointStyle: false,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Сравнение V остаточные по методам',
        font: {
          size: 16
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'V остаточные'
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', marginTop: '20px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ResultsBarChart;
