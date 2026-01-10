'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { CLIENT_DISPUTE_REASONS } from '@/types/interfaces/IDispute';

interface CancelContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reasonCode: string; description: string }) => void;
  requiresDispute: boolean;
  isProcessing?: boolean;
  contractId: string;
}

export const CancelContractModal = ({
  isOpen,
  onClose,
  onConfirm,
  requiresDispute,
  isProcessing,
  contractId,
}: CancelContractModalProps) => {
  const [reasonCode, setReasonCode] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ reasonCode?: string; description?: string }>({});

  const handleClose = () => {
    setReasonCode('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { reasonCode?: string; description?: string } = {};
    
    if (!reasonCode) {
      newErrors.reasonCode = 'Please select a cancellation reason';
    }
    
    if (!description || description.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters describing the issue';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onConfirm({ reasonCode, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Cancel Contract</h2>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {requiresDispute && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Dispute Required</h3>
                <p className="text-sm text-amber-700">
                  This contract has submitted deliverables. A dispute will be created and reviewed by admin to determine the refund amount.
                </p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              disabled={isProcessing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a reason</option>
              {CLIENT_DISPUTE_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            {errors.reasonCode && (
              <p className="mt-1 text-sm text-red-600">{errors.reasonCode}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isProcessing}
              rows={5}
              placeholder="Please provide details about why you're cancelling this contract..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Contract
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Cancel Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
