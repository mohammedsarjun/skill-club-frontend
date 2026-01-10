"use client";

import React, { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  onBlockClient?: (userId: string) => Promise<void>;
}

export default function UserDetailModal({
  open,
  onOpenChange,
  user,
  onBlockClient,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "client" | "freelancer">(
    "overview"
  );
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 bg-gray-50">
          <button
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          {user.clientDetail && (
            <button
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "client" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("client")}
            >
              Client
            </button>
          )}

          {user.freelancerDetail && (
            <button
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "freelancer" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("freelancer")}
            >
              Freelancer
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                <p className="text-lg text-gray-900 mt-1">{user.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                <p className="text-lg text-gray-900 mt-1">{user.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
                <p className="text-lg text-gray-900 mt-1">{user.phone || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Roles</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.roles.map((role: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{role}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "client" && user.clientDetail && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Company Name</label>
                <p className="text-lg text-gray-900 mt-1">{user.clientDetail.companyName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Logo</label>
                <div className="mt-2">
                  {user.clientDetail.companyLogo ? (
                    <img src={user.clientDetail.companyLogo} className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200" alt="Company logo" />
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Website</label>
                <p className="text-lg text-gray-900 mt-1">{user.clientDetail.website || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                <p className="text-gray-900 mt-1 leading-relaxed">{user.clientDetail.companyDescription || "N/A"}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                {confirmBlock === `client-${user.id}` ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-3 font-medium">Are you sure you want to {user.isClientBlocked ? "unblock" : "block"} this client?</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          onBlockClient && onBlockClient(user.id);
                          setConfirmBlock(null);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <FaCheck className="mr-2" /> Confirm
                      </button>
                      <button
                        onClick={() => setConfirmBlock(null)}
                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmBlock(`client-${user.id}`)}
                    className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                      user.isClientBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {user.isClientBlocked ? "Unblock Client" : "Block Client"}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "freelancer" && user.freelancerDetail && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Professional Role</label>
                <p className="text-lg text-gray-900 mt-1">{user.freelancerDetail.professionalRole || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hourly Rate</label>
                <p className="text-lg text-gray-900 mt-1">{user.freelancerDetail.hourlyRate || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Languages</label>
                <p className="text-lg text-gray-900 mt-1">{(user.freelancerDetail.languages || []).join(", ") || "N/A"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Logo</label>
                <div className="mt-2">
                  {user.freelancerDetail.freelancerLogo ? (
                    <img src={user.freelancerDetail.freelancerLogo} className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200" alt="Freelancer logo" />
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
