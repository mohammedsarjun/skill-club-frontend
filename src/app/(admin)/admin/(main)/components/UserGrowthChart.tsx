'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { IUserGrowthDataPoint } from '@/types/interfaces/IAdminDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserGrowthChartProps {
  data: IUserGrowthDataPoint[];
  filter: string;
  onFilterChange: (filter: string) => void;
}

export const UserGrowthChart = ({ data, filter, onFilterChange }: UserGrowthChartProps) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Freelancers',
        data: data.map(d => d.freelancers),
        backgroundColor: '#8b5cf6',
      },
      {
        label: 'Clients',
        data: data.map(d => d.clients),
        backgroundColor: '#10b981',
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
        <h2 className="text-xl font-semibold text-gray-800">User Growth</h2>
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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
