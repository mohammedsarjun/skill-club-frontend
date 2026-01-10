import React, { useState } from 'react';
import { DollarSign, AlertCircle, CheckCircle, Clock, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { IPaymentResponse } from '@/types/interfaces/IPayment';

interface HourlyPaymentModalProps {
  contractId?: string;
  hourlyRate: number;
  estimatedHoursPerWeek: number;
  title?: string;
  description?: string;
  onClose: () => void;
  onPayment?: (amount: number, hours: number) => Promise<void>;
}

export  const HourlyPaymentModal = ({
  contractId,
  hourlyRate,
  estimatedHoursPerWeek,
  title = 'Hourly Contract Payment',
  description = 'Fund your hourly contract',
  onClose,
  onPayment
}: HourlyPaymentModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'estimated' | 'manual'>('estimated');
  const [manualHours, setManualHours] = useState('');

  const estimatedAmount = hourlyRate * estimatedHoursPerWeek;
  const manualAmount = manualHours ? hourlyRate * parseFloat(manualHours) : 0;
  const paymentAmount = paymentMode === 'estimated' ? estimatedAmount : manualAmount;
  const paymentHours = paymentMode === 'estimated' ? estimatedHoursPerWeek : parseFloat(manualHours || '0');

    const handlePayNow = async () => {
      setIsProcessing(true);
  
      try {
        const purpose = "hourly_advance";
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  
        const response = await clientActionApi.initiatePayment({
          contractId: contractId as string,
          amount: paymentAmount as number,
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


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

//   const handlePayNow = async () => {
//     if (paymentMode === 'manual' && (!manualHours || parseFloat(manualHours) <= 0)) {
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       if (onPayment) {
//         await onPayment(paymentAmount, paymentHours);
//       }
//       onClose();
//     } catch (error) {
//       setIsProcessing(false);
//       alert((error as Error).message || 'Failed to initiate payment');
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     onClose();
//   };

//   if (!isOpen) return null;

  const canPay = paymentMode === 'estimated' || (paymentMode === 'manual' && manualHours && parseFloat(manualHours) > 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-indigo-100 text-sm">{description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
     <div className="px-8 py-8 overflow-y-auto">
          {/* Contract Details */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100 text-center">
              <DollarSign className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Hourly Rate</div>
              <div className="text-sm font-bold text-gray-900">{formatCurrency(hourlyRate)}</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100 text-center">
              <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 mb-1">Est. Hours/Week</div>
              <div className="text-sm font-bold text-gray-900">{estimatedHoursPerWeek}h</div>
            </div>
          </div>

          {/* Payment Mode Toggle */}
          <div className="mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMode('estimated')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  paymentMode === 'estimated'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pay Estimated
              </button>
              <button
                onClick={() => setPaymentMode('manual')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  paymentMode === 'manual'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pay Manually
              </button>
            </div>
          </div>

          {/* Manual Input */}
          {paymentMode === 'manual' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Number of Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                placeholder="Enter hours"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none"
              />
            </div>
          )}

          {/* Amount Display */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6 text-center border border-indigo-100">
            <div className="flex justify-center mb-3">
              <div className="bg-indigo-100 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Payment Amount</div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatCurrency(paymentAmount)}
            </div>
            <div className="flex items-center justify-center gap-2 text-amber-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Payment Pending</span>
            </div>
          </div>

          {/* Payment Info */}
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

          {/* Action Button */}
          <button
            onClick={handlePayNow}
            disabled={!canPay || isProcessing}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
              !canPay || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isProcessing
              ? 'Processing Payment...'
              : `Pay ${formatCurrency(paymentAmount)} Now`}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            By proceeding, you agree to fund this contract amount
          </p>
        </div>
      </div>
    </div>
  );

}
// // Demo Component
// export default function App() {
//   const [showModal, setShowModal] = useState(false);

//   const handlePayment = async (amount: number, hours: number) => {
//     console.log('Payment:', { amount, hours });
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     alert(`Payment of $${amount} for ${hours} hours completed!`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">
//           Hourly Contract Payment
//         </h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
//         >
//           Open Payment Modal
//         </button>
//       </div>

//       {/* {showModal && (
//         <HourlyPaymentModal
//           contractId="contract_123"
//           hourlyRate={75}
//           onClose={() => setShowModal(false)}
//           onPayment={handlePayment}
//         />
//       )} */}
//     </div>
//   );
// }