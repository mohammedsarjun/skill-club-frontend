"use client"
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { IClientFinance } from '@/types/interfaces/IClientFinance';
import FinanceStats from './components/FinanceStats';
import TransactionList from './components/TransactionList';
import WithdrawalForm from './components/WithdrawalForm';

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('spent');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [financeData, setFinanceData] = useState<IClientFinance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  useEffect(() => {
    if (activeTab === 'withdrawal') {
      fetchWithdrawals(1);
    }
  }, [activeTab]);

  const fetchFinanceData = async () => {
    setLoading(true);
    const response = await clientActionApi.getFinanceData();
    if (response.success) {
      setFinanceData(response.data);
    }
    setLoading(false);
  };

  const withdrawalRequests = [
    {
      id: 'WD001',
      amount: 200,
      requestedAt: '2024-01-06',
      status: 'pending',
      note: 'Withdrawal for refund amount'
    },
    {
      id: 'WD002',
      amount: 150,
      requestedAt: '2024-01-02',
      status: 'completed',
      note: 'Previous withdrawal',
      completedAt: '2024-01-03'
    }
  ];

  const [withdrawals, setWithdrawals] = useState<Array<any>>([]);
  const [withdrawalsPage, setWithdrawalsPage] = useState(1);
  const [withdrawalsLimit] = useState(5);
  const [withdrawalsTotal, setWithdrawalsTotal] = useState(0);

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (financeData && parseFloat(withdrawAmount) > financeData.stats.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    
    alert(`Withdrawal request for ₹${withdrawAmount} submitted successfully!`);
    setWithdrawAmount('');
    setWithdrawNote('');
  };

  const fetchWithdrawals = async (page = 1) => {
    const res = await clientActionApi.getWithdrawals(page, withdrawalsLimit);
    if (res?.success) {
      setWithdrawals(res.data || []);
      setWithdrawalsTotal(res.total || 0);
      setWithdrawalsPage(res.page || page);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading finance data...</div>
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Failed to load finance data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Dashboard</h1>
          <p className="text-gray-600">Manage your transactions and withdrawals</p>
        </div>

        <FinanceStats stats={financeData.stats} />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('spent')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'spent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Money Spent
              </button>
              <button
                onClick={() => setActiveTab('refunded')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'refunded'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Refunds
              </button>
              <button
                onClick={() => setActiveTab('withdrawal')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'withdrawal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Withdrawals
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Spent Tab */}
            {activeTab === 'spent' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
                <TransactionList transactions={financeData.spentTransactions} type="spent" />
              </div>
            )}

            {/* Refunded Tab */}
            {activeTab === 'refunded' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund History</h2>
                <TransactionList transactions={financeData.refundTransactions} type="refund" />
              </div>
            )}

            {/* Withdrawal Tab */}
            {activeTab === 'withdrawal' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Withdrawal</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Available Balance: ₹{financeData.stats.availableBalance.toFixed(2)}</p>
                          <p>You can withdraw money from your refunded amount.</p>
                        </div>
                      </div>
                    </div>

                    <WithdrawalForm
                      available={financeData.stats.availableBalance}
                      onSuccess={() => { fetchFinanceData(); fetchWithdrawals(1); }}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Withdrawal History</h2>
                    <div className="space-y-4">
                      {withdrawals.map((t) => (
                        <div key={t.transactionId} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">₹{t.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                            </div>
                            {t.status === 'withdrawal_requested' ? (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                            <span>Requested: {t.createdAt}</span>
                            {getStatusBadge(t.status === 'withdrawal_requested' ? 'pending' : 'completed')}
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-center space-x-3 mt-4">
                        <button
                          disabled={withdrawalsPage <= 1}
                          onClick={() => fetchWithdrawals(withdrawalsPage - 1)}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <div className="text-sm text-gray-600">Page {withdrawalsPage} of {Math.max(1, Math.ceil(withdrawalsTotal / withdrawalsLimit))}</div>
                        <button
                          disabled={withdrawalsPage >= Math.ceil(withdrawalsTotal / withdrawalsLimit)}
                          onClick={() => fetchWithdrawals(withdrawalsPage + 1)}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;