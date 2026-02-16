'use client';

import { useEffect, useState } from 'react';
import { ContractTimeline as IContractTimeline, ContractActivity } from '@/types/interfaces/IContractActivity';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import { adminActionApi } from '@/api/adminActionApi';
import { FaUser, FaRobot, FaUserTie, FaUserCheck } from 'react-icons/fa';

interface ContractTimelineProps {
  contractId: string;
  role: 'client' | 'freelancer' | 'admin';
}

export const ContractTimeline: React.FC<ContractTimelineProps> = ({ contractId, role }) => {
  const [timeline, setTimeline] = useState<IContractTimeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTimeline();
  }, [contractId, role]);

  const loadTimeline = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (role === 'client') {
        response = await clientActionApi.getContractTimeline(contractId);
      } else if (role === 'freelancer') {
        response = await freelancerActionApi.getContractTimeline(contractId);
      } else {
        response = await adminActionApi.getContractTimeline(contractId);
      }
      
      if (response.success && response.data) {
        setTimeline(response.data);
      } else {
        setError('Failed to load timeline');
      }
    } catch (err) {
      setError('An error occurred while loading timeline');
    } finally {
      setLoading(false);
    }
  };

  const getActorIcon = (role: string) => {
    switch (role) {
      case 'client':
        return <FaUserTie className="text-blue-600" />;
      case 'freelancer':
        return <FaUserCheck className="text-green-600" />;
      case 'system':
        return <FaRobot className="text-gray-600" />;
      case 'admin':
        return <FaUserTie className="text-purple-600" />;
      default:
        return <FaUser className="text-gray-600" />;
    }
  };

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  if (!timeline || !timeline.activities || timeline.activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-gray-500 text-center">No timeline activities yet</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Contract Timeline</h3>
      <div className="space-y-6">
        {timeline.activities.map((activity, index) => (
          <div key={activity.activityId} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300">
                {getActorIcon(activity.actor.role)}
              </div>
              {index !== timeline.activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  {activity.metadata && (
                    <div className="mt-2 text-xs text-gray-500">
                      {activity.metadata.amount && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                          Amount: ₹{activity.metadata.amount}
                        </span>
                      )}
                      {activity.metadata.reason && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {activity.metadata.reason}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span className="capitalize">{activity.actor.role}</span>
                {activity.actor.name && <span>• {activity.actor.name}</span>}
                <span>• {formatDate(activity.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
