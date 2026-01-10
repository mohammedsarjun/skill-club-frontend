"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../common/Button";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { updateFreelancerData } from "@/store/slices/freelancerSlice"; // adjust path
import { educationSchema } from "@/utils/validations/validation";
// Zod schema for education


interface StepSixProps {
  onBack: () => void;
  onNext: (data: any) => void;
  savedData?: any; // saved from Redux/persist
}

export default function StepSixForm({ onBack, onNext, savedData }: StepSixProps) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [educations, setEducations] = useState<any[]>(savedData?.educations || []);
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const years = Array.from({ length: 50 }, (_, i) => 2025 - i);

  useEffect(() => {
    // Update Redux whenever educations change
    dispatch(updateFreelancerData({ educations }));
  }, [educations, dispatch]);

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "school": setSchool(value); break;
      case "degree": setDegree(value); break;
      case "field": setField(value); break;
      case "startYear": setStartYear(value); break;
      case "endYear": setEndYear(value); break;
    }
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { school, degree, field, startYear, endYear };
    const result = educationSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const updated = [...educations, formData]; // compute new array
    setEducations(updated); // update state
    // Redux persist handled by useEffect
    setSchool(""); setDegree(""); setField(""); setStartYear(""); setEndYear("");
    setErrors({});
    setIsOpen(false);
  };

  const handleClose = () => setIsOpen(false);

  const removeEducation = (index: number) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated); // Redux persist handled by useEffect
  };

  return (
    <div>
      <p className="text-gray-500">5/9</p>
      <h2 className="text-2xl font-semibold mb-2">
        Clients like to know what you know - add your education here.
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        You don’t have to have a degree. Adding any relevant education helps make your profile more visible.
      </p>

      <div className="relative w-full max-w-sm sm:w-1/2 md:w-1/3 h-40 bg-[#F5F5F5] rounded-xl p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-13 left-10 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600"
        >
          <FiPlus size={20} />
        </button>
        <p className="absolute bottom-5 left-10 text-sm sm:text-base font-semibold">Add Education</p>
      </div>

      {/* Show saved educations */}
      {educations.length > 0 && (
        <div className="mt-4 space-y-2">
          {educations.map((edu, idx) => (
            <div
              key={idx}
              className="border p-3 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-sm">{edu.startYear} - {edu.endYear}</p>
              </div>
              <button
                onClick={() => removeEducation(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6 items-center">
        <Button content="Back" type="button" variant="secondary" onClick={onBack} />
        <div className="flex items-center gap-4">
          <span
            className="text-green-600 cursor-pointer font-semibold"
            onClick={() => onNext(null)}
          >
            Skip for now
          </span>
          <Button
            content="Next"
            type="button"
            onClick={() => onNext({ educations })}
            disabled={educations.length === 0}
          />
        </div>
      </div>

      {/* Education form modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/15">
          <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Add Education</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ex: Harvard University"
                  value={school}
                  onChange={(e) => handleFieldChange("school", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Ex: Bachelor’s"
                  value={degree}
                  onChange={(e) => handleFieldChange("degree", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Ex: Computer Science"
                  value={field}
                  onChange={(e) => handleFieldChange("field", e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors.field && <p className="text-red-500 text-sm">{errors.field}</p>}
              </div>
              <div className="flex space-x-2">
                <select
                  value={startYear}
                  onChange={(e) => handleFieldChange("startYear", e.target.value)}
                  className="w-1/2 border px-3 py-2 rounded"
                >
                  <option value="">Start Year</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <select
                  value={endYear}
                  onChange={(e) => handleFieldChange("endYear", e.target.value)}
                  className="w-1/2 border px-3 py-2 rounded"
                >
                  <option value="">End Year</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              {(errors.startYear || errors.endYear) && (
                <p className="text-red-500 text-sm">{errors.startYear || errors.endYear}</p>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={handleClose} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
