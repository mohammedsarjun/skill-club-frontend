"use client";
import { useEffect, useState } from "react";
import Input from "@/components/common/Input";
import DynamicFormModal from "@/components/common/Form";
import { Field } from '@/types/interfaces/forms';
import { clientActionApi } from "@/api/action/ClientActionApi";
import { SelectedSpecialitiesSchema } from "@/utils/validations/clientValidations";
import { JobData } from "@/types/interfaces/IClient";
import DivSpinner from "@/components/common/DivSpinner";

interface JobCreationStep2Props {
  step: string;
  totalSteps: string;
  setIsNextAllowed: (value: boolean) => void;
  setJobSavedData: React.Dispatch<React.SetStateAction<JobData>>;
}

interface Skill {
  skillId: string;
  skillName: string;
}

interface Speciality {
  specialityId: string;
  specialityName: string;
  skills: Skill[];
}

function JobFormStep2({
  step,
  totalSteps,
  setIsNextAllowed,
  setJobSavedData,
}: JobCreationStep2Props) {
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [specialityOptions, setSpecialityOptions] = useState<Speciality[]>();
  const [specialityError, setSpecialityError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // 🌀 loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecialitiesWithSkills() {
      try {
        setIsLoading(true);
        const savedData = sessionStorage.getItem("jobSavedData");
        const parsedSavedData = savedData ? JSON.parse(savedData) : null;
        const selectedCategory = parsedSavedData?.category;

        const specialityResponse =
          await clientActionApi.getSpecialitiesWithSkills(selectedCategory);

        setSpecialityOptions(specialityResponse.data);
      } catch (error) {
        console.error("Error fetching specialities and skills:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSpecialitiesWithSkills();
  }, []);

  // ✅ Validation (runs only after user touches)
  useEffect(() => {
    if (!touched) return;
    const result = SelectedSpecialitiesSchema.safeParse(selectedSpecialities);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(" ");
      setSpecialityError(message);
    } else {
      setSpecialityError(null);
    }
  }, [selectedSpecialities, touched]);

  // ✅ Handle speciality selection (max 3)
  const handleSpecialitySelect = (specialityId: string) => {
    setTouched(true);
    setSelectedSpecialities((prev) => {
      const isSelected = prev.includes(specialityId);
      if (isSelected) {
        return prev.filter((id) => id !== specialityId);
      }
      if (prev.length >= 3) {
        setSpecialityError("You can select up to 3 specialities only.");
        return prev;
      }
      return [...prev, specialityId];
    });
  };

  // ✅ Handle skill selection
  const handleSkillChange = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // ✅ Get all available skills based on selected specialities
  const availableSkills = specialityOptions
    ? specialityOptions
        .filter((spec) => selectedSpecialities.includes(spec.specialityId))
        .flatMap((spec) => spec.skills)
    : [];

  // ✅ Update jobSavedData and next-step permission
  useEffect(() => {
    if (selectedSpecialities.length > 0 && selectedSkills.length > 0) {
      setJobSavedData((prev) => ({
        ...prev,
        specialities: selectedSpecialities,
        skills: selectedSkills,
      }));
      setIsNextAllowed(true);
    } else {
      setIsNextAllowed(false);
    }
  }, [selectedSpecialities, selectedSkills, setIsNextAllowed, setJobSavedData]);

  // ✅ Load previously saved data
  useEffect(() => {
    const savedData = sessionStorage.getItem("jobSavedData");
    if (!savedData) return;

    const parsedSavedData: JobData = JSON.parse(savedData);

    if (parsedSavedData.specialities) {
      setSelectedSpecialities(parsedSavedData.specialities);
    }

    if (parsedSavedData.skills) {
      setSelectedSkills(parsedSavedData.skills);
    }
  }, []);

  // 🌀 Show spinner while loading
  if (isLoading) {
    return (
      <div className="relative min-h-[300px] flex items-center justify-center">
        <DivSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8">
      <div className="w-full md:w-1/2 space-y-6">
        <p className="text-gray-500">{`${step}/${totalSteps}`}</p>
        <h2 className="text-4xl">
          What are the main specialties and skills required for your work?
        </h2>
      </div>

      <div className="w-full md:w-1/2 space-y-6 mt-6 md:mt-0">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Specialities
          </label>
          <div className="flex flex-wrap gap-2">
            {specialityOptions &&
              specialityOptions.map((speciality) => (
                <button
                  key={speciality.specialityId}
                  onClick={() =>
                    handleSpecialitySelect(speciality.specialityId)
                  }
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedSpecialities.includes(speciality.specialityId)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {speciality.specialityName}
                </button>
              ))}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Select up to 3 specialities.
          </p>
          {specialityError && touched && (
            <p className="mt-2 text-sm text-red-600">{specialityError}</p>
          )}

          <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
            + View More Specialities
          </button>
        </div>

        {availableSkills.length > 0 && (
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <button
                  key={skill.skillId}
                  onClick={() => handleSkillChange(skill.skillId)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedSkills.includes(skill.skillId)
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {skill.skillName}
                </button>
              ))}
            </div>
            <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
              + View More Skills
            </button>
          </div>
        )}

        {(selectedSpecialities.length > 0 || selectedSkills.length > 0) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
            {selectedSpecialities.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Specialities:</span>{" "}
                {specialityOptions &&
                  specialityOptions
                    .filter((spec) =>
                      selectedSpecialities.includes(spec.specialityId)
                    )
                    .map((spec) => spec.specialityName)
                    .join(", ")}
              </p>
            )}
            {selectedSkills.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Skills:</span>{" "}
                {availableSkills
                  .filter((skill) => selectedSkills.includes(skill.skillId))
                  .map((skill) => skill.skillName)
                  .join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobFormStep2;
