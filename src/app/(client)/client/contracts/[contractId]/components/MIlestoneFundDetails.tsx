import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { useParams } from 'next/navigation';
import { IPaymentResponse } from '@/types/interfaces/IPayment';
import Swal from 'sweetalert2';


interface MilestonePaymentModalProp {
    id?: string;
    milestoneId: string;
    title: string;
    amount: number;
    amountBaseUSD?: number;
    expectedDelivery: string;
    status: 'pending_funding' | 'funded' | 'under_review' | 'submitted' | 'approved' | 'paid';
    submittedAt?: string;
    approvedAt?: string;
    revisionsAllowed?: number;
    deliverables?: {
      id: string;
      submittedBy: string;
      files: { fileName: string; fileUrl: string }[];
      message?: string;
      status: 'submitted' | 'approved' | 'changes_requested';
      version: number;
      submittedAt: string;
      approvedAt?: string;
      revisionsRequested?: number;
      revisionsAllowed?: number;
      revisionsLeft?: number;
    }[];
    extensionRequest?: {
      requestedBy: string;
      requestedDeadline: string;
      reason: string;
      status: 'pending' | 'approved' | 'rejected';
      requestedAt: string;
      respondedAt?: string;
      responseMessage?: string;
    };
}

const MilestonePaymentModal = ({
  milestones,
  onClose
}: {
  milestones: MilestonePaymentModalProp[];
  onClose: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [processingId, setProcessingId] =  useState<string | null>(null);
  const params= useParams();
  const contractId = params.contractId as string;

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones
    .filter(m => m.status !== 'pending_funding')
    .reduce((sum, m) => sum + m.amount, 0);

 

  const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle,
          className: 'bg-green-50 text-green-700 border-green-200',
          iconColor: 'text-green-600'
        };
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
          iconColor: 'text-yellow-600'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: AlertCircle,
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          iconColor: 'text-blue-600'
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-gray-50 text-gray-700 border-gray-200',
          iconColor: 'text-gray-600'
        };
    }
  };

  const handlePayNow =async (milestoneId: string, amount: number) => {
    // setProcessingId(milestoneId);


          
        try {
          const purpose ="milestone_funding"

    
    
          const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
    
          const response = await clientActionApi.initiatePayment({
            contractId,
            milestoneId,
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
          await Swal.fire({
            title: "Error",
            text: (error as Error).message || "Failed to initiate payment",
            icon: "error",
          });
        }

  };

  const handlePayAll = async () => {
    setProcessingId('all');
    try {

      const response = await clientActionApi.initiatePayment({
        contractId,
        amount: totalAmount,
        purpose: 'contract_funding',
        returnUrl: `${window.location.origin}/client/contracts/${contractId}?payment=success`,
        cancelUrl: `${window.location.origin}/client/contracts/${contractId}?payment=cancelled`,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to initiate payment');
      }
      const paymentData: IPaymentResponse = response.data;
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.payuUrl;
      const formData = { ...paymentData.payuConfig, udf1: contractId };
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      onClose();
    } catch (error) {
      setProcessingId(null);
      await Swal.fire({ title: 'Error', text: (error as Error).message || 'Failed to initiate payment', icon: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
  <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">

    {/* ================= HEADER ================= */}
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white shrink-0">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Contract Milestones</h2>
          <p className="text-indigo-100 text-sm">
            Review and fund project milestones
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Total Progress</span>
          <span className="font-semibold">
            {formatCurrency(paidAmount)} / {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${(paidAmount / totalAmount) * 100}%` }}
          />
        </div>
      </div>
    </div>

    {/* ================= BODY (SCROLLABLE) ================= */}
    <div className="flex-1 overflow-y-auto px-8 py-6 overscroll-contain">
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const statusConfig = getStatusConfig(milestone.status);
          const StatusIcon = statusConfig.icon;
          const isProcessing = processingId === milestone.milestoneId;

          return (
            <div
              key={milestone.milestoneId}
              className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      Milestone {index + 1}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig.className}`}
                    >
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.iconColor}`} />
                      {statusConfig.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {milestone.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    Expected: {formatDate(milestone.expectedDelivery)}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(milestone.amount)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {2} revisions
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handlePayNow(milestone.milestoneId, milestone.amount)
                }
                disabled={
                  milestone.status === "funded" ||
                  isProcessing ||
                  paidAmount === totalAmount
                }
                className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                  milestone.status === "funded"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isProcessing
                    ? "bg-indigo-400 text-white cursor-wait"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                }`}
              >
                {milestone.status !== "pending_funding"
                  ? "✓ Paid"
                  : isProcessing
                  ? "Processing..."
                  : `Pay ${formatCurrency(milestone.amount)} Now`}
              </button>
            </div>
          );
        })}
      </div>
    </div>


  </div>
</div>

  );
};

export default MilestonePaymentModal;