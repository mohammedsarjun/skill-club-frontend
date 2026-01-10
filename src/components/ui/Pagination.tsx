"use client";

import React from "react";

interface Props {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  className?: string;
}

export default function Pagination({ page, setPage, totalPages, className = "" }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-center gap-2 mt-8 ${className}`}>
      <button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 border border-[hsl(0,0%,90%)] rounded-lg text-[hsl(0,0%,15%)] hover:bg-[hsl(0,0%,95%)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            aria-current={page === p ? "page" : undefined}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === p
                ? "bg-[#14A800] text-white"
                : "border border-[hsl(0,0%,90%)] text-[hsl(0,0%,15%)] hover:bg-[hsl(0,0%,95%)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 border border-[hsl(0,0%,90%)] rounded-lg text-[hsl(0,0%,15%)] hover:bg-[hsl(0,0%,95%)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
