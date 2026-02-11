"use client";

import React from "react";

type Props = {
  roleFilter: string | undefined;
  statusFilter: string | undefined;
  onChange: (k: string, v: string | undefined) => void;
};

export default function Filters({ roleFilter, statusFilter, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Role</label>
        <select value={roleFilter || ""} onChange={(e) => onChange('role', e.target.value || undefined)} className="ml-2 border rounded p-2 bg-white">
          <option value="">All</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Status</label>
        <select value={statusFilter || ""} onChange={(e) => onChange('status', e.target.value || undefined)} className="ml-2 border rounded p-2 bg-white">
          <option value="">All</option>
          <option value="withdrawal_requested">Requested</option>
          <option value="withdrawal_approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
