import React, { useState } from 'react';
import { DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { useParams } from 'next/navigation';
import { IPaymentResponse } from '@/types/interfaces/IPayment';
import Swal from 'sweetalert2';

interface FixedPaymentModalProps {
  contractId?: string;
  amount: number;
  title?: string;
  description?: string;
  status?: 'pending' | 'funded';
  onClose: () => void;
}

const FixedPaymentModal = ({
  contractId: propContractId,
  amount,
  title = 'Contract Payment',
  description = 'Fund the complete contract amount',
  status = 'pending',
  onClose
}: FixedPaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const params = useParams();
  const contractId = propContractId || (params.contractId as string);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);

    try {
      const purpose = "contract_funding";
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

      const response = await clientActionApi.initiatePayment({
        contractId,
        amount,
        purpose,
        returnUrl: `${window.location.origin}/client/contracts/${contractId}?payment=success`,
        cancelUrl: `${window.location.origin}/client/contracts/${contractId}?payment=cancelled`,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to initiate payment");
      }

      const paymentData: IPaymentResponse = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentData.payuUrl;

      const formData = {
        ...paymentData.payuConfig,
        udf1: contractId,
      };

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      onClose();
    } catch (error) {
      setIsProcessing(false);
      await Swal.fire({
        title: "Error",
        text: (error as Error).message || "Failed to initiate payment",
        icon: "error",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  const isPaid = status === 'funded';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-indigo-100 text-sm">{description}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Amount Display */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 text-center border border-indigo-100">
            <div className="flex justify-center mb-3">
              <div className="bg-indigo-100 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Payment Amount</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatCurrency(amount)}
            </div>
            {isPaid ? (
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Payment Completed</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Payment Pending</span>
              </div>
            )}
          </div>

          {/* Payment Info */}
          {!isPaid && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Secure Payment</p>
                  <p className="text-blue-700">
                    You'll be redirected to a secure payment gateway to complete this transaction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePayNow}
            disabled={isPaid || isProcessing}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              isPaid
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isProcessing
                ? 'bg-indigo-400 text-white cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isPaid
              ? '✓ Already Paid'
              : isProcessing
              ? 'Processing Payment...'
              : `Pay ${formatCurrency(amount)} Now`}
          </button>

          {!isPaid && (
            <p className="text-center text-xs text-gray-500 mt-4">
              By proceeding, you agree to fund this contract amount
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedPaymentModal;