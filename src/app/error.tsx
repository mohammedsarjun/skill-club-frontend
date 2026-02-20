"use client";

import { useEffect } from "react";
import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Error Boundary:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-20">
      <ErrorPlaceholder 
        title="Oops! Something went wrong" 
        message={error.message || "We encountered an error while processing your request. Our team has been notified."}
        onRetry={() => reset()} 
      />
    </div>
  );
}
