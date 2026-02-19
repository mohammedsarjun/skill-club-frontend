"use client";

import { useState } from "react";

const PAGES = [
  {
    id: "terms",
    label: "Terms & Conditions",
    icon: "📄",
    lastUpdated: "Jan 12, 2025",
    content: `Terms & Conditions\n\nWelcome to our platform. By accessing or using our services, you agree to be bound by these Terms and Conditions.\n\n1. Acceptance of Terms\nBy using this service, you confirm that you are at least 18 years of age and have the legal capacity to enter into this agreement.\n\n2. Use of Service\nYou agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others.\n\n3. Changes to Terms\nWe reserve the right to modify these terms at any time. We will notify users of significant changes via email.`,
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "🔒",
    lastUpdated: "Jan 15, 2025",
    content: `Privacy Policy\n\nYour privacy is important to us. This policy explains how we collect, use, and protect your personal information.\n\n1. Information We Collect\nWe collect information you provide directly to us, such as when you create an account or contact support.\n\n2. How We Use Your Information\nWe use the information to provide and improve our services, process transactions, and comply with legal obligations.\n\n3. Data Security\nWe implement appropriate security measures to protect your personal information against unauthorized access.`,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: "❓",
    lastUpdated: "Feb 01, 2025",
    content: `Frequently Asked Questions\n\nHow do I create an account?\nClick the "Sign Up" button on our homepage and follow the registration steps.\n\nWhat payment methods do you accept?\nWe accept all major credit cards, PayPal, and bank transfers for enterprise accounts.\n\nCan I cancel my subscription at any time?\nYes, you can cancel your subscription at any time from your account settings.\n\nHow do I contact support?\nYou can reach our support team via live chat or by emailing support@example.com.`,
  },
  {
    id: "about",
    label: "About Us",
    icon: "👥",
    lastUpdated: "Dec 20, 2024",
    content: `About Us\n\nWe are a passionate team of innovators dedicated to building tools that empower businesses and individuals to achieve more.\n\nOur Story\nFounded in 2020, we started with a simple mission: make powerful technology accessible to everyone.\n\nOur Mission\nTo democratize access to cutting-edge technology and provide tools that help our users succeed.\n\nOur Values\nTransparency, Innovation, and putting Users first in every decision we make.`,
  },
];

export default function ContentManagementPage() {
  const [pages, setPages] = useState(PAGES);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedPage = pages.find((p) => p.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setSaved(false);
  };

  const handleChange = (text) => {
    setPages((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, content: text } : p))
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? {
              ...p,
              lastUpdated: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            }
          : p
      )
    );
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-green-600 font-semibold uppercase tracking-widest">Admin</p>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">Content Management</h1>
          </div>
        </div>

        {selectedPage && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
              saved
                ? "bg-green-50 text-green-700 border border-green-300"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── LIST VIEW ── */}
        {!selectedPage && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Static Pages</h2>
              <p className="text-sm text-gray-500 mt-1">Select a page to edit its content.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleSelect(page.id)}
                  className="group bg-white border border-gray-200 hover:border-green-400 rounded-xl p-5 text-left transition-all hover:shadow-md flex items-center gap-4"
                >
                  <span className="text-3xl">{page.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Last updated: {page.lastUpdated}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── EDITOR VIEW ── */}
        {selectedPage && (
          <div>
            {/* Breadcrumb */}
            <button
              onClick={() => { setSelectedId(null); setSaved(false); }}
              className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-medium mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Pages
            </button>

            {/* Editor card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-green-50">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedPage.icon}</span>
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedPage.label}</h2>
                    <p className="text-xs text-gray-400">Last updated: {selectedPage.lastUpdated}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-white border border-green-200 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Published
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={selectedPage.content}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full min-h-[480px] p-5 text-gray-700 text-sm leading-relaxed resize-none outline-none border-none focus:ring-0"
                placeholder="Enter page content here…"
                spellCheck
              />

              {/* Footer actions */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400">
                  {selectedPage.content.length} characters
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedId(null); setSaved(false); }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${
                      saved
                        ? "bg-green-50 text-green-700 border border-green-300"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}