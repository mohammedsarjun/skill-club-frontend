"use client";

import { useState, useEffect } from "react";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IContentItem } from "@/types/interfaces/IContent";
import Link from "next/link";

export default function TermsPage() {
  const [content, setContent] = useState<IContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const response = await AdminActionApi.getPublishedContentBySlug("terms");
      if (response.success && response.data) {
        setContent(response.data);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Page not found</p>
          <Link
            href="/"
            className="text-green-600 hover:text-green-800 text-sm mt-2 inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="text-sm text-green-600 hover:text-green-800 font-medium mb-4 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-3xl">{content.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{content.title}</h1>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Last updated:{" "}
            {new Date(content.updatedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
            {content.content}
          </div>
        </div>
      </div>
    </div>
  );
}
