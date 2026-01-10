"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { clientActionApi } from "@/api/action/ClientActionApi";
import Swal from "sweetalert2";
import { IPaymentResponse } from "@/types/interfaces/IPayment";

interface FundContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  amount: number;
  paymentType: "fixed" | "fixed_with_milestones" | "hourly";
  onSuccess: () => void;
}

export const FundContractModal = ({
  isOpen,
  onClose,
  contractId,
  amount,
  paymentType,
  onSuccess,
}: FundContractModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const preferredCurrency = "INR";

  const handleFundContract = async () => {
    setIsProcessing(true);
    try {
      const purpose =
        paymentType === "fixed" || paymentType === "fixed_with_milestones"
          ? "contract_funding"
          : "hourly_advance";

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
      await Swal.fire({
        title: "Error",
        text: (error as Error).message || "Failed to initiate payment",
        icon: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] flex flex-col">

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Fund Contract
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            You are about to fund this contract with:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">
              {preferredCurrency} {amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {paymentType === "hourly"
                ? "Minimum advance for hourly contract"
                : "Full contract amount"}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You will be redirected to PayU payment
            gateway to complete the payment. Funds will be held in escrow until
            work is completed.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleFundContract}
            disabled={isProcessing}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              isProcessing
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              isProcessing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            } text-gray-700`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
