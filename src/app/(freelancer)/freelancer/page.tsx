'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Video, Bell, Star, Calendar, Clock, TrendingUp, Award, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { MeetingsSection } from './components/MeetingsSection';
import { ReviewsSection } from './components/ReviewsSection';
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

  const notifications = [
    { id: 1, type: 'payment', message: 'Payment of $1,500 received from Sarah Johnson', time: '2 hours ago', icon: DollarSign, color: 'text-green-500' },
    { id: 2, type: 'message', message: 'New message from Mike Chen about project updates', time: '4 hours ago', icon: MessageSquare, color: 'text-blue-500' },
    { id: 3, type: 'contract', message: 'Contract approved for Logo Redesign project', time: '1 day ago', icon: CheckCircle, color: 'text-purple-500' },
    { id: 4, type: 'meeting', message: 'Meeting reminder: E-commerce Website discussion tomorrow', time: '1 day ago', icon: Video, color: 'text-orange-500' },
  ];

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
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map(notif => (
                  <div key={notif.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <notif.icon className={`w-5 h-5 ${notif.color} flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        <ReviewsSection reviewStats={reviewStats} />
      </div>
    </div>
  );
};

export default FreelancerDashboard;