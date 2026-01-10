"use client";
import React from "react";
import { FaShieldAlt, FaEnvelope } from "react-icons/fa";

function ClientBlockPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaShieldAlt className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
           Your Client Account Suspended
          </h1>

          <p className="text-slate-600 mb-6 leading-relaxed">
            Your account has been temporarily suspended due to a violation of our terms of service.
            Access to this platform is currently restricted.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">
              Why was I blocked?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Common reasons include policy violations, suspicious activity, or non-compliance with community guidelines.
            </p>
          </div>

          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
        <FaEnvelope className="w-5 h-5" />
            Contact Support
          </button>

          <p className="text-xs text-slate-500 mt-6">
            If you believe this is a mistake, please reach out to our support team for assistance.
          </p>
        </div>
    </div>
  );
}

export default function ClientBlock() {
  return <ClientBlockPage />;
}
