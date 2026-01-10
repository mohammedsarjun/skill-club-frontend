"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { JobData } from "@/types/interfaces/IClient";
import { JobDescriptionSchema } from "@/utils/validations/clientValidations";

// ✅ Dynamically import React Quill to avoid SSR issues in Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface JobCreationStep4Props {
  step: string;
  totalSteps: string;
  setIsNextAllowed: (value: boolean) => void;
  setJobSavedData: React.Dispatch<React.SetStateAction<JobData>>;
}


function JobFormStep4({
  step,
  totalSteps,
  setIsNextAllowed,
  setJobSavedData,
}: JobCreationStep4Props) {
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // ✅ Validation runs whenever description changes
  useEffect(() => {
    const cleanText = description.replace(/<[^>]*>/g, ""); // strip HTML for raw length
    const result = JobDescriptionSchema.safeParse(description);

    if (result.success) {
      setError("");
      setIsNextAllowed(true);
      setJobSavedData((prev) => ({ ...prev, description }));
    } else {
      setError(result.error.issues[0]?.message || "");
      setIsNextAllowed(false);
    }
  }, [description]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

    useEffect(() => {
    const savedData = sessionStorage.getItem("jobSavedData");
    if (!savedData) return;

    const parsedSavedData: JobData = JSON.parse(savedData);

    if (parsedSavedData.description) {
      setDescription(parsedSavedData.description);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8">
      {/* Left Side */}
      <div className="w-full md:w-1/2 space-y-6">
        <p className="text-gray-500">{`${step}/${totalSteps}`}</p>
        <h2 className="text-4xl">Start the conversation.</h2>
        <p className="text-md text-gray-600">Talent are looking for:</p>

        <ul className="list-disc list-inside text-gray-600 text-sm space-y-3 mt-2">
          <li>Clear expectations about your task or deliverables</li>
          <li>The skills required for your work</li>
          <li>Good communication</li>
          <li>Details about how you or your team like to work</li>
        </ul>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 space-y-3 mt-6 md:mt-0 relative">
        <p className="mt-4">Describe what you need</p>

        {/* ✅ React Quill Editor */}
        <ReactQuill
          theme="bubble"
          value={description}
          onChange={setDescription}
          modules={modules}
          placeholder="Already have a description? Paste it here!"
          className="h-48 bg-white border border-gray-300 rounded-lg"
            style={{ height: "300px" }} 
        />

        {/* ✅ Character Counter (bottom-left) */}
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-xs mt-1">
            {description.replace(/<[^>]*>/g, "").length}/50,000 • Minimum 50
            characters required
          </p>
        </div>

        {/* ✅ Error only for invalid spaces */}
        {error && error.includes("spaces") && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

export default JobFormStep4;
