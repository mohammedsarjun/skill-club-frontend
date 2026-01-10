"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../common/Button";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFreelancerData,
  removeFromObjectArrayField,
} from "@/store/slices/freelancerSlice";

const experienceSchema = z
  .object({
    title: z.string().min(2, "Title is required"),
    company: z.string().min(2, "Company is required"),
    location: z.string().min(2, "Location is required"),
    country: z.string().min(2, "Country is required"),
    startMonth: z.string().min(1, "Start month is required"),
    startYear: z.string().min(4, "Start year is required"),
    currentRole: z.boolean(),
    endMonth: z.string().optional(),
    endYear: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.currentRole) {
      if (!data.endMonth) ctx.addIssue({ path: ["endMonth"], message: "End month is required", code: "custom" });
      if (!data.endYear) ctx.addIssue({ path: ["endYear"], message: "End year is required", code: "custom" });
    }
  });

interface StepFiveProps {
  onBack: () => void;
  onNext: (data: any) => void;
}

export default function StepFiveForm({ onBack, onNext }: StepFiveProps) {
  const dispatch = useDispatch();
  const savedData = useSelector((state: any) => state.freelancer);

  // Form fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [currentRole, setCurrentRole] = useState(false);
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [experiences, setExperiences] = useState<any[]>(savedData?.experiences || []);
  const [errors, setErrors] = useState<Partial<Record<string, string | undefined>>>({});

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 50 }, (_, i) => 2025 - i);

  // Restore saved data when Redux changes
  useEffect(() => {
    if (savedData?.experiences) setExperiences(savedData.experiences);
  }, [savedData?.experiences]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      title, company, location, country,
      startMonth, startYear,
      currentRole,
      endMonth: currentRole ? undefined : endMonth,
      endYear: currentRole ? undefined : endYear,
    };

    const result = experienceSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<string, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    // Save to local state
    setExperiences(prev => {
    
      const updated = [...prev, formData];
      dispatch(updateFreelancerData({ experiences: updated })); // persist to Redux
      return updated;
    });

    // Reset form
    setTitle(""); setCompany(""); setLocation(""); setCountry("");
    setStartMonth(""); setStartYear(""); setEndMonth(""); setEndYear("");
    setCurrentRole(false);
    setErrors({});
    setIsOpen(false);
  };

  // Remove experience
  const removeExperience = (index: number) => {
    setExperiences(prev => {
      const updated = prev.filter((_, i) => i !== index);
  setExperiences(updated); // state update
  // ✅ side effect outside of setState callback
  dispatch(updateFreelancerData({ experiences: updated }));
      return updated;
    });
  };

  return (
    <div>
      <p className="text-gray-500">4/9</p>
      <h2 className="text-2xl font-semibold mb-2">Add relevant work experience</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Adding experience increases your chances of getting projects.
      </p>

      {/* Add button */}
     <div className="relative w-full max-w-sm sm:w-1/2 md:w-1/3 h-40 bg-[#F5F5F5] rounded-xl p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-13 left-10 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600"
        >
          <FiPlus size={20} />
        </button>
        <p className="absolute bottom-5 left-10 text-sm sm:text-base font-semibold">Add Experience</p>
      </div>


      {/* Show saved experiences */}
      {experiences.length > 0 && (
        <div className="mt-4 space-y-2">
          {experiences.map((exp, idx) => (
            <div key={idx} className="border p-3 rounded bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-semibold">{exp.title} at {exp.company}</p>
                <p className="text-sm text-gray-600">{exp.location}, {exp.country}</p>
                <p className="text-sm">{exp.startMonth} {exp.startYear} - {exp.currentRole ? "Present" : `${exp.endMonth} ${exp.endYear}`}</p>
              </div>
              <button onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700">
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6 items-center">
        <Button content="Back" type="button" variant="secondary" onClick={onBack} />
        <div className="flex items-center gap-4">
          <span className="text-green-600 cursor-pointer font-semibold" onClick={() => onNext(null)}>Skip for now</span>
          <Button
            content="Next"
            type="button"
            onClick={() => onNext({ experiences })}
            disabled={experiences.length === 0}
          />
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/15">
          <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Add Experience</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

              <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full border px-3 py-2 rounded" />
              {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}

              <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full border px-3 py-2 rounded" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

              <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} className="w-full border px-3 py-2 rounded" />
              {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={currentRole} onChange={e => setCurrentRole(e.target.checked)} />
                <span>I am currently working in this role</span>
              </label>

              <div className="flex space-x-2">
                <select value={startMonth} onChange={e => setStartMonth(e.target.value)} className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Start Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={startYear} onChange={e => setStartYear(e.target.value)} className="w-1/2 border px-3 py-2 rounded">
                  <option value="">Start Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {(errors.startMonth || errors.startYear) && <p className="text-red-500 text-sm">{errors.startMonth || errors.startYear}</p>}

              {!currentRole && (
                <div className="flex space-x-2">
                  <select value={endMonth} onChange={e => setEndMonth(e.target.value)} className="w-1/2 border px-3 py-2 rounded">
                    <option value="">End Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={endYear} onChange={e => setEndYear(e.target.value)} className="w-1/2 border px-3 py-2 rounded">
                    <option value="">End Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              )}
              {!currentRole && (errors.endMonth || errors.endYear) && <p className="text-red-500 text-sm">{errors.endMonth || errors.endYear}</p>}

              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
