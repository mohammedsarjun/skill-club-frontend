import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "../common/Button";
import { onboardingApi } from "@/api/onboardingApi";
import toast from "react-hot-toast";

interface StepThreeProps {
  onBack: () => void;
  onNext: (data: { skills: { value: string; label: string }[] }) => void;
  savedData?: any;
}

export default function StepThreeForm({
  onBack,
  onNext,
  savedData,
}: StepThreeProps) {
  const [skills, setSkills] = useState<{ value: string; label: string }[]>([]);
  const [input, setInput] = useState("");
  const [suggestedSkills, setSuggestedSkills] = useState([
  ]);

  // ✅ Load saved skills if available
  useEffect(() => {
    if (savedData?.skills) {
      setSkills(savedData.skills);
    }

    async function fetchSuggestedSkills() {
      const response = await onboardingApi.getSuggestedSkills(
        savedData.specialties
      );

      if (response.success) {
        setSuggestedSkills(response.data);
      } else {
        toast.error(response.message);
      }
    }

    fetchSuggestedSkills();
  }, [savedData]);

  const MAX_SKILLS = 15;
  const addSkill = (skill: { value: string; label: string }) => {
    if (
      skill.value &&
      !skills.some((s) => s.value === skill.value) &&
      skills.length < MAX_SKILLS
    ) {
      setSkills((prev) => [...prev, skill]);
    }
    setInput("");
  };

  const removeSkill = (value: { value: string; label: string }) => {
    setSkills((prev) => prev.filter((skill) => skill.value !== value.value));
  };

  function handleNext() {
    onNext({ skills });
  }

  return (
    <div>
      {/* Step Indicator */}
      <p className="text-gray-500">2/9</p>

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">
        Nearly there! What work are you here to do?
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-6 text-sm">
        Your skills show clients what you can offer, and help us choose which
        jobs to recommend to you. Add or remove the ones we’ve suggested, or
        start typing to pick more. It’s up to you.
      </p>

      {/* Input field */}
      <label className="block text-gray-700 mb-2 font-medium">
        Your skills
      </label>
   

      {/* Added skills */}
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span
            key={skill.value}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {skill.label}
            <FaTimes
              className="ml-2 cursor-pointer hover:text-red-500"
              onClick={() => removeSkill(skill)}
            />
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {skills.length}/{MAX_SKILLS} skills added
      </p>

      {/* Suggested skills */}
      <p className="text-gray-700 mb-2 font-medium">Suggested skills</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {skills && suggestedSkills.map((s:{value:string,label:string}) => {
          const isSelected = skills.some((skill:{value:string}) => skill.value === s.value);
          const isDisabled = skills.length >= MAX_SKILLS && !isSelected;

          return (
            <button
              key={s.value}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              }`}
              onClick={() => addSkill({ value: s.value, label: s.label })}
              disabled={isDisabled}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button content="Back" type="button" variant="secondary" onClick={onBack} />
        <Button
          content="Next"
          type="button"
          onClick={handleNext}
          disabled={skills.length === 0}
        />
      </div>
    </div>
  );
}
