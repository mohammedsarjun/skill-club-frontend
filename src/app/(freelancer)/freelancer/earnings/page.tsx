"use client"

import React, { useState, useEffect } from 'react';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import EarningsOverview from './components/EarningsOverview';
import TransactionsTable from './components/TransactionsTable';
import PeriodFilter from './components/PeriodFilter';
import Pagination from '@/components/common/Pagination';
import { IFreelancerEarningsOverview, IFreelancerTransaction } from '@/types/interfaces/IFreelancerEarnings';

const FreelancerEarnings = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [earningsOverview, setEarningsOverview] = useState<IFreelancerEarningsOverview>({
    available: 0,
    pending: 0,
    totalEarnings: 0,
  });
  const [transactions, setTransactions] = useState<IFreelancerTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'custom' | null>(null);
  const [customDateRange, setCustomDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    fetchEarningsOverview();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, selectedPeriod, customDateRange]);

  const fetchEarningsOverview = async () => {
    try {
      const response = await freelancerActionApi.getEarningsOverview();
      if (response?.success && response?.data) {
        setEarningsOverview(response.data);
      }
    } catch (error) {
      console.error('Error fetching earnings overview:', error);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const query: {
        page: number;
        limit: number;
        period?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page: currentPage,
        limit: 10,
      };

      if (selectedPeriod === 'custom' && customDateRange.startDate && customDateRange.endDate) {
        query.startDate = customDateRange.startDate.toISOString();
        query.endDate = customDateRange.endDate.toISOString();
      } else if (selectedPeriod && selectedPeriod !== 'custom') {
        query.period = selectedPeriod;
      }

      const response = await freelancerActionApi.getTransactions(query);
      if (response?.success && response?.data) {
        setTransactions(response.data.items || []);
        setTotalPages(response.data.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (period: 'week' | 'month' | 'year' | 'custom') => {
    setSelectedPeriod(period);
    setCurrentPage(1);
    if (period !== 'custom') {
      setCustomDateRange({ startDate: null, endDate: null });
    }
  };

  const handleCustomDateChange = (startDate: Date | null, endDate: Date | null) => {
    setCustomDateRange({ startDate, endDate });
    if (startDate && endDate) {
      setSelectedPeriod('custom');
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings</h1>

        <EarningsOverview data={earningsOverview} />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'transactions'
                    ? 'border-[#14A800] text-[#14A800]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'withdrawals'
                    ? 'border-[#14A800] text-[#14A800]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Withdrawal History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'transactions' && (
              <>
                <PeriodFilter
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  customDateRange={customDateRange}
                  onCustomDateChange={handleCustomDateChange}
                />

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14A800]"></div>
                  </div>
                ) : (
                  <>
                    <TransactionsTable transactions={transactions} />
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-6"
                      />
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'withdrawals' && (
              <div className="text-center py-12 text-gray-500">
                Withdrawal history will be implemented soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
