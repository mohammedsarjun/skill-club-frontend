"use client";

import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

// Global error must have its own html and body tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="max-w-xl w-full p-8 bg-white rounded-2xl shadow-2xl">
          <ErrorPlaceholder 
            title="Critical System Error" 
            message="A critical error occurred that prevented the application from loading. Please try refreshing the page."
            onRetry={() => reset()} 
          />
        </div>
      </body>
    </html>
  );
}
