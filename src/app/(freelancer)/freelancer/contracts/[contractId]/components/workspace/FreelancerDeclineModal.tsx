"use client";

import React, { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";

const reasonSchema = z.string().min(3, "Reason must be at least 3 characters");

interface FreelancerDeclineModalProps {
  open: boolean;
  meetingId?: string;
  onClose: () => void;
  onSubmit: (meetingId: string, reason: string) => Promise<void>;
}

export default function FreelancerDeclineModal({ open, meetingId, onClose, onSubmit }: FreelancerDeclineModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    const parsed = reasonSchema.safeParse(reason);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!meetingId) return;
    try {
      setSubmitting(true);
      await onSubmit(meetingId, reason);
      toast.success("Reschedule request declined");
      setReason("");
      onClose();
    } catch (err) {
      toast.error("Failed to decline reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-3">Decline Reschedule Request</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-200 rounded-md p-2 mb-4 h-28"
          placeholder="Provide reason for declining the reschedule request"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded-md bg-red-600 text-white"
          >
            {submitting ? "Declining..." : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}
