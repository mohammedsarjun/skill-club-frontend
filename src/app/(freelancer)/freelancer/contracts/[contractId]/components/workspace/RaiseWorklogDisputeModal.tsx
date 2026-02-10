"use client";
import { useState } from 'react';
import { z } from 'zod';

const raiseDisputeSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
});

interface RaiseWorklogDisputeModalProps {
  worklogId: string;
  onClose: () => void;
  onSubmit: (worklogId: string, description: string) => Promise<void>;
}

export const RaiseWorklogDisputeModal = ({ worklogId, onClose, onSubmit }: RaiseWorklogDisputeModalProps) => {
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const validatedData = raiseDisputeSchema.parse({ description });
      setErrors({});
      setIsSubmitting(true);
      await onSubmit(worklogId, validatedData.description);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Raise Dispute</h2>
        <p className="text-gray-600 mb-6">
          Please provide a detailed description of why you believe this worklog rejection was unfair.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dispute Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why you believe the rejection was unfair..."
            className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
            rows={6}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Raise Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
};
