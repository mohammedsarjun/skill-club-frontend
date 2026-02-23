'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Video, Star, Calendar, Clock, TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { MeetingsSection } from './components/MeetingsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { NotificationsSection } from './components/NotificationsSection';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import { useRouter } from 'next/navigation';
import {
  IFreelancerContractStats,
  IFreelancerEarnings,
  IFreelancerMeeting,
  IFreelancerReviewStats,
} from '@/types/interfaces/IFreelancerDashboard';

const FreelancerDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contractStats, setContractStats] = useState<IFreelancerContractStats>({
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [earnings, setEarnings] = useState<IFreelancerEarnings>({
    total: 0,
    available: 0,
    commission: 0,
    pending: 0,
  });
  const [meetings, setMeetings] = useState<IFreelancerMeeting[]>([]);
  const [reviewStats, setReviewStats] = useState<IFreelancerReviewStats>({
    average: 0,
    total: 0,
    recent: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [contractsResponse, earningsResponse, meetingsResponse, reviewsResponse] = await Promise.all([
        freelancerActionApi.getDashboardContractStats(),
        freelancerActionApi.getDashboardEarnings(),
        freelancerActionApi.getDashboardMeetings(),
        freelancerActionApi.getDashboardReviewStats(),
      ]);

      if (contractsResponse.success) {
        setContractStats(contractsResponse.data);
      }

      if (earningsResponse.success) {
        setEarnings(earningsResponse.data);
      }

      if (meetingsResponse.success) {
        setMeetings(meetingsResponse.data);
      }

      if (reviewsResponse.success) {
        setReviewStats(reviewsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meetingId: string, channelName: string) => {
    if (channelName) {
      router.push(`/freelancer/meetings/${meetingId}/join`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Freelancer Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contracts & Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Active Contracts" value={contractStats.active} icon={Briefcase} color="bg-blue-500" />
            <StatCard title="Pending Offers" value={contractStats.pending} icon={Clock} color="bg-yellow-500" />
            <StatCard title="Completed" value={contractStats.completed} icon={CheckCircle} color="bg-green-500" />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Earnings & Finance <DollarSign className="w-5 h-5 text-green-500" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Earnings" 
              value={formatCurrency(earnings.total)} 
              icon={TrendingUp} 
              color="bg-green-500"
              subtitle="Lifetime earnings"
            />
            <StatCard 
              title="Available Balance" 
              value={formatCurrency(earnings.available)} 
              icon={DollarSign} 
              color="bg-blue-500"
              subtitle="Ready to withdraw"
            />
            <StatCard 
              title="Platform Commission" 
              value={formatCurrency(earnings.commission)} 
              icon={AlertCircle} 
              color="bg-orange-500"
              subtitle="Commission paid"
            />
            <StatCard 
              title="Pending Payment" 
              value={formatCurrency(earnings.pending)} 
              icon={Clock} 
              color="bg-purple-500"
              subtitle="In escrow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MeetingsSection meetings={meetings} onJoinMeeting={handleJoinMeeting} />
          <NotificationsSection />
        </div>

        <ReviewsSection reviewStats={reviewStats} />
      </div>
    </div>
  );
};

export default FreelancerDashboard;