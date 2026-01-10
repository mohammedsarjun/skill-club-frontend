'use client';

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, DollarSign, UserCheck } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { RevenueChart } from './components/RevenueChart';
import { UserGrowthChart } from './components/UserGrowthChart';
import AdminActionApi from '@/api/action/AdminActionApi';
import {
  IAdminDashboardStats,
  IAdminDashboardRevenue,
  IAdminDashboardUserGrowth,
  IRevenueDataPoint,
  IUserGrowthDataPoint,
  IRecentContract,
  IRecentReview,
} from '@/types/interfaces/IAdminDashboard';
import RecentContracts from './components/RecentContracts';
import RecentReviews from './components/RecentReviews';

const AdminDashboard = () => {
  const [revenueFilter, setRevenueFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [growthFilter, setGrowthFilter] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [stats, setStats] = useState<IAdminDashboardStats>({
    totalFreelancers: 0,
    totalClients: 0,
    activeJobs: 0,
    monthlyRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState<IAdminDashboardRevenue>({
    weekly: [],
    monthly: [],
    yearly: [],
  });
  const [growthData, setGrowthData] = useState<IAdminDashboardUserGrowth>({
    weekly: [],
    monthly: [],
    yearly: [],
  });
  const [recentContracts, setRecentContracts] = useState<IRecentContract[]>([]);
  const [recentReviews, setRecentReviews] = useState<IRecentReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, revenueResponse, growthResponse, contractsResponse, reviewsResponse] = await Promise.all([
        AdminActionApi.getDashboardStats(),
        AdminActionApi.getRevenueData(),
        AdminActionApi.getUserGrowthData(),
        AdminActionApi.getRecentContracts(5),
        AdminActionApi.getRecentReviews(5),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (revenueResponse.success) {
        setRevenueData(revenueResponse.data);
      }

      if (growthResponse.success) {
        setGrowthData(growthResponse.data);
      }

      if (contractsResponse.success) {
        setRecentContracts(contractsResponse.data);
      }

      if (reviewsResponse.success) {
        setRecentReviews(reviewsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentRevenueData = (): IRevenueDataPoint[] => {
    return revenueData[revenueFilter] || [];
  };

  const getCurrentGrowthData = (): IUserGrowthDataPoint[] => {
    return growthData[growthFilter] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Freelancers" 
            value={stats.totalFreelancers.toLocaleString()} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients.toLocaleString()} 
            icon={UserCheck} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Active Jobs" 
            value={stats.activeJobs.toLocaleString()} 
            icon={Briefcase} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Monthly Revenue" 
            value={formatCurrency(stats.monthlyRevenue)} 
            icon={DollarSign} 
            color="bg-yellow-500" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={getCurrentRevenueData()} 
            filter={revenueFilter} 
            onFilterChange={(filter) => setRevenueFilter(filter as 'weekly' | 'monthly' | 'yearly')} 
          />
          <UserGrowthChart 
            data={getCurrentGrowthData()} 
            filter={growthFilter} 
            onFilterChange={(filter) => setGrowthFilter(filter as 'weekly' | 'monthly' | 'yearly')} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentContracts contracts={recentContracts} />
          <RecentReviews reviews={recentReviews} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
