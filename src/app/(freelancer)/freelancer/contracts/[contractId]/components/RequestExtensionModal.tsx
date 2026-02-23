"use client";

import { useState } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import {BeautifulCalendar} from '@/components/common/Calandar';
import { formatDate } from '@/utils/formatDate';

interface RequestExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractEndDate: string;
  onSubmit: (requestedDeadline: string, reason: string) => Promise<void>;
}

export default function RequestExtensionModal({
  isOpen,
  onClose,
  contractEndDate,
  onSubmit,
}: RequestExtensionModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDate || !reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedDate.toISOString(), reason);
      setSelectedDate(null);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error submitting extension request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Request Deadline Extension</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-600 mb-2">
              Current deadline: {formatDate(contractEndDate)}
            </p>
            <p className="text-sm text-gray-500">
              Select a new deadline and provide a reason for the extension request.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              New Deadline
            </label>
            <BeautifulCalendar
              onChange={handleDateSelect}
              value={selectedDate || undefined}
              minDate={new Date(contractEndDate)}
            />
            {selectedDate && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {formatDate(selectedDate)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Extension
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need a deadline extension..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
            />
            <p className="mt-1 text-sm text-gray-500">
              {reason.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !reason.trim() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
