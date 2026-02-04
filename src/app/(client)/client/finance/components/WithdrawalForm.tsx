"use client"
import React, { useState } from 'react';
import { z } from 'zod';
import { clientActionApi } from '@/api/action/ClientActionApi';
import toast from 'react-hot-toast';

const WithdrawSchema = z.object({
  amount: z.number().positive(),
  note: z.string().optional(),
});

interface Props {
  available: number;
  onSuccess?: () => void;
}

export default function WithdrawalForm({ available, onSuccess }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = WithdrawSchema.safeParse({ amount: Number(amount), note });
    if (!parsed.success) {
      toast.error('Enter a valid amount');
      return;
    }

    if (parsed.data.amount > available) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    const res = await clientActionApi.requestWithdrawal(parsed.data.amount, parsed.data.note);
    setLoading(false);

    if (res?.success) {
      toast.success('Withdrawal request submitted');
      setAmount('');
      setNote('');
      onSuccess?.();
    } else {
      toast.error(res?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Add a note about this withdrawal"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
      </button>
    </form>
  );
}
