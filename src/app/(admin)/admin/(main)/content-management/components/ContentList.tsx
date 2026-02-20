"use client";

import { IContentItem } from "@/types/interfaces/IContent";

interface ContentListProps {
  pages: IContentItem[];
  onSelect: (slug: string) => void;
  loading: boolean;
}

export default function ContentList({ pages, onSelect, loading }: ContentListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Static Pages</h2>
        <p className="text-sm text-gray-500 mt-1">Select a page to edit its content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelect(page.slug)}
            className="group bg-white border border-gray-200 hover:border-green-400 rounded-xl p-5 text-left transition-all hover:shadow-md flex items-center gap-4"
          >
            <span className="text-3xl">{page.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                {page.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Last updated:{" "}
                {new Date(page.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${
                  page.isPublished ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    page.isPublished ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                {page.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </>
  );
}
