"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminActionApi from '@/api/action/AdminActionApi';
import StatsCard from './components/StatsCard';
import RevenueTrendChart from './components/RevenueTrendChart';
import DateRangeFilter from './components/DateRangeFilter';
import TransactionsTable from './components/TransactionsTable';
import {
  IRevenueStats,
  IRevenueChartDataPoint,
  IRevenueTransaction,
} from '@/types/interfaces/IRevenue';

type DateRangeType = 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom';

const AdminRevenueDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>('thisMonth');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [transactions, setTransactions] = useState<IRevenueTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<IRevenueStats>({
    totalRevenue: 0,
    totalCommissions: 0,
    totalTransactions: 0,
    averageCommission: 0,
    growth: 0,
  });
  const [chartData, setChartData] = useState<IRevenueChartDataPoint[]>([]);

  const fetchRevenueData = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const params: {
        period?: string;
        startDate?: string;
        endDate?: string;
      } = {};

      if (dateRange === 'custom' && customStartDate && customEndDate) {
        params.period = 'custom';
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      } else if (dateRange !== 'custom') {
        params.period = dateRange;
      }

      const response = await AdminActionApi.getRevenue(params);

      if (response?.success && response?.data) {
        setStats(response.data.stats);
        setChartData(response.data.chartData);
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, customStartDate, customEndDate]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const downloadInvoice = (): void => {
    const headers = ['Transaction ID', 'Date', 'Client', 'Freelancer', 'Amount', 'Status', 'Description'];
    const rows = transactions.map((t) => [
      t.transactionId,
      new Date(t.createdAt).toLocaleDateString(),
      t.clientId.name,
      t.freelancerId.name,
      `₹${t.amount.toLocaleString('en-IN')}`,
      t.status,
      t.description,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Track commission revenue and transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={`${stats.growth >= 0 ? '+' : ''}${stats.growth}%`}
            changePositive={stats.growth >= 0}
          />
          <StatsCard
            label="Commission Count"
            value={stats.totalCommissions.toString()}
            change="+8 this week"
            changePositive={true}
          />
          <StatsCard
            label="Total Transactions"
            value={stats.totalTransactions.toString()}
            change="+15%"
            changePositive={true}
          />
          <StatsCard
            label="Avg Commission"
            value={formatCurrency(stats.averageCommission)}
            change="+5.2%"
            changePositive={true}
          />
        </div>

        <div className="mb-6">
          <RevenueTrendChart data={chartData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>

              <div className="flex items-center gap-4">
                <DateRangeFilter
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  customStartDate={customStartDate}
                  setCustomStartDate={setCustomStartDate}
                  customEndDate={customEndDate}
                  setCustomEndDate={setCustomEndDate}
                />

                <button
                  onClick={downloadInvoice}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>

          <TransactionsTable transactions={transactions} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueDashboard;
