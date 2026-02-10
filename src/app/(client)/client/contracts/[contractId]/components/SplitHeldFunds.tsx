"use client"

import React, { useState } from 'react';
import { X, DollarSign, User, Briefcase } from 'lucide-react';

interface SplitHeldFundsProps {
  isOpen: boolean;
  onClose: () => void;
  heldAmount: number;
  onSubmit: (clientPercentage: number, freelancerPercentage: number, reason: string) => void;
  reason: string;
}

export default function SplitHeldFundsModal({ isOpen, onClose, heldAmount, onSubmit, reason }: SplitHeldFundsProps) {


  const [clientPercentage, setClientPercentage] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  
  const freelancerPercentage = 100 - clientPercentage;
  
  const clientAmount = (heldAmount * clientPercentage / 100).toFixed(2);
  const freelancerAmount = (heldAmount * freelancerPercentage / 100).toFixed(2);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientPercentage(Number(e.target.value));
  };

  const handleSubmit = () => {
    onSubmit(clientPercentage, freelancerPercentage, reason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Split Held Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Held Amount Display */}
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Total Held Amount</div>
            <div className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <DollarSign size={28} />
              {heldAmount.toFixed(2)}
            </div>
          </div>

          {/* Split Visualization */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 text-center">
              Drag to adjust split percentage
            </div>

            {/* Visual Split Bar */}
            <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-200"
                style={{ width: `${clientPercentage}%` }}
              />
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-200"
                style={{ width: `${freelancerPercentage}%` }}
              />
              {/* Percentage Labels - Always Visible */}
              <div className="absolute inset-0 flex pointer-events-none">
                <div 
                  className="flex items-center text-white font-semibold text-sm"
                  style={{ 
                    width: `${clientPercentage}%`,
                    justifyContent: clientPercentage < 10 ? 'flex-start' : 'center',
                    paddingLeft: clientPercentage < 10 ? '8px' : '0'
                  }}
                >
                  {clientPercentage > 0 && `${clientPercentage}%`}
                </div>
                <div 
                  className="flex items-center text-white font-semibold text-sm"
                  style={{ 
                    width: `${freelancerPercentage}%`,
                    justifyContent: freelancerPercentage < 10 ? 'flex-end' : 'center',
                    paddingRight: freelancerPercentage < 10 ? '8px' : '0'
                  }}
                >
                  {freelancerPercentage > 0 && `${freelancerPercentage}%`}
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="relative px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={clientPercentage}
                onChange={handleSliderChange}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${clientPercentage}%, #10b981 ${clientPercentage}%, #10b981 100%)`
                }}
              />
            </div>

            {/* Amount Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Client */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Client</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${clientAmount}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {clientPercentage}%
                </div>
              </div>

              {/* Freelancer */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Freelancer</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${freelancerAmount}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {freelancerPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              This proposal will be sent to both parties for review and approval.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Send Proposal
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: transform 0.1s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb:active {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}