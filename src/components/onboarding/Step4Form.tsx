import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

interface StepFourProps {
  onBack: () => void;
  onNext: (data: { professionalRole: string }) => void;
  savedData?: { professionalRole?: string }; // ✅ receive savedData
}

export default function StepFourForm({ onBack, onNext, savedData }: StepFourProps) {
  const [formData, setFormData] = useState("");

  // ✅ Load saved data if available
  useEffect(() => {
    if (savedData?.professionalRole) {
      setFormData(savedData.professionalRole);
    }
  }, [savedData]);

  // Validate input: remove leading/trailing spaces, at least 3 characters
  const isValid = formData.trim().length >= 3;

  function handleNext() {
    if (!isValid) return; // safety check
    onNext({ professionalRole: formData.trim() });
  }

  return (
    <div>
      {/* Step Indicator */}
      <p className="text-gray-500">3/9</p>

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">
        Got it. Now, add a title to tell the world what you do.
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-sm">
        It’s the very first thing clients see, so make it count. Stand out by
        describing your expertise in your own words.
      </p>

      <p className="text-md font-semibold mb-2">Your Professional Role</p>

      <Input
        type="text"
        value={formData} // ✅ controlled input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(e.target.value)}
        placeholder="Example: Web, App & Software Dev"
        name="professionalRole"
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button content="Back" type="button" variant="secondary" onClick={onBack} />
        <Button
          content="Next"
          type="button"
          onClick={handleNext}
          disabled={!isValid} // disable until valid
        />
      </div>
    </div>
  );
}
