"use client";

import { useEffect } from "react";
import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

export default function FreelancerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Freelancer Section Error:", error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 mt-8 border border-gray-100 min-h-[50vh] flex items-center justify-center">
      <ErrorPlaceholder 
        title="Unexpected Error" 
        message="We're having trouble loading this freelancer module. Don't worry, your work is safe. Please try again."
        onRetry={() => reset()} 
      />
    </div>
  );
}
