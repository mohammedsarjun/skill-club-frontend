"use client";

import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { formatDateLong as formatDate } from '@/utils/formatDate';

interface ExtensionRequestCardProps {
  extensionRequest: {
    requestedBy: string;
    requestedDeadline: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
    respondedAt?: string;
    responseMessage?: string;
  };
  currentEndDate: string;
  onRespond: (approved: boolean, responseMessage?: string) => Promise<void>;
}

export default function ExtensionRequestCard({
  extensionRequest,
  currentEndDate,
  onRespond,
}: ExtensionRequestCardProps) {
  const [isResponding, setIsResponding] = useState(false);

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: 'Approve Extension Request',
      text: 'Do you want to approve this deadline extension?',
      input: 'textarea',
      inputLabel: 'Response Message (Optional)',
      inputPlaceholder: 'Enter your response...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setIsResponding(true);
      try {
        await onRespond(true, result.value);
      } finally {
        setIsResponding(false);
      }
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: 'Reject Extension Request',
      text: 'Please provide a reason for rejecting this request',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter your reason...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide a reason for rejection';
        }
        return null;
      },
    });

    if (result.isConfirmed) {
      setIsResponding(true);
      try {
        await onRespond(false, result.value);
      } finally {
        setIsResponding(false);
      }
    }
  };



  const getStatusBadge = () => {
    switch (extensionRequest.status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Pending</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Rejected</span>;
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaCalendarAlt className="mr-2 text-yellow-600" />
          Deadline Extension Request
        </h3>
        {getStatusBadge()}
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Deadline</p>
            <p className="font-medium text-gray-800">{formatDate(currentEndDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Requested Deadline</p>
            <p className="font-medium text-blue-600">{formatDate(extensionRequest.requestedDeadline)}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Reason</p>
          <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">
            {extensionRequest.reason}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <FaClock className="mr-2" />
          Requested on {formatDate(extensionRequest.requestedAt)}
        </div>

        {extensionRequest.status !== 'pending' && extensionRequest.respondedAt && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Response</p>
            {extensionRequest.responseMessage && (
              <p className="text-gray-800 bg-white p-3 rounded border border-gray-200">
                {extensionRequest.responseMessage}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Responded on {formatDate(extensionRequest.respondedAt)}
            </p>
          </div>
        )}
      </div>

      {extensionRequest.status === 'pending' && (
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleApprove}
            disabled={isResponding}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <FaCheckCircle className="mr-2" />
            {isResponding ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={handleReject}
            disabled={isResponding}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <FaTimesCircle className="mr-2" />
            {isResponding ? 'Processing...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
}
