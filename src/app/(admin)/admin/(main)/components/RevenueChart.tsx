'use client';

import React from 'react';
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
import { IRevenueDataPoint } from '@/types/interfaces/IAdminDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: IRevenueDataPoint[];
  filter: string;
  onFilterChange: (filter: string) => void;
}

export const RevenueChart = ({ data, filter, onFilterChange }: RevenueChartProps) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Revenue Overview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange('weekly')}
            className={`px-3 py-1 text-sm rounded ${filter === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => onFilterChange('monthly')}
            className={`px-3 py-1 text-sm rounded ${filter === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => onFilterChange('yearly')}
            className={`px-3 py-1 text-sm rounded ${filter === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
