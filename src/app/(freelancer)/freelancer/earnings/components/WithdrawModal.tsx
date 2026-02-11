"use client"
import { useState } from 'react';
import { z } from 'zod';
import type { FormEvent } from 'react';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import toast from 'react-hot-toast';

const WithdrawSchema = z.object({
  amount: z.number().positive(),
  note: z.string().optional(),
});

interface Props {
  available: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function WithdrawModal({ available, onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
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
    const res = await (freelancerActionApi as any).requestWithdrawal(parsed.data.amount, parsed.data.note);
    setLoading(false);

    if (res?.success) {
      toast.success('Withdrawal request submitted');
      setAmount('');
      setNote('');
      onSuccess?.();
      onClose();
    } else {
      toast.error(res?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Request Withdrawal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter amount" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} placeholder="Add a note" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#14A800] text-white py-2 rounded">{loading ? 'Submitting...' : 'Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
