import { useState } from 'react';

interface AcceptOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface RejectOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export function AcceptOfferModal({
  isOpen,
  onClose,
  onConfirm,
}: AcceptOfferModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Accept Offer</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to accept this offer? By accepting, you agree to
          all the terms and conditions outlined in the offer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-[#108A00] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export function RejectOfferModal({
  isOpen,
  onClose,
  onConfirm,
}: RejectOfferModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Decline Offer</h3>
        <p className="text-gray-700 mb-4">
          Are you sure you want to decline this offer? This action cannot be undone.
        </p>
        <textarea
          placeholder="Optional: Provide a reason for declining"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#108A00] focus:border-transparent"
          rows={4}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              onClose();
              setReason('');
            }}
            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
