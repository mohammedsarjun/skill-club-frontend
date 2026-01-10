"use client";
import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateFreelancerData } from "@/store/slices/freelancerSlice"; // adjust path

interface StepSevenProps {
  onBack: () => void;
  onNext: (data: any) => void;
  savedData?: any; // saved from Redux/persist
}

interface Language {
  id: number;
  name: string;
  proficiency: "Conversational" | "Fluent";
  mandatory?: boolean;
}

export default function StepSevenForm({ onBack, onNext, savedData }: StepSevenProps) {
  const dispatch = useDispatch();

  const [languages, setLanguages] = useState<Language[]>(
    savedData?.languages?.length
      ? savedData.languages.map((lang: any, idx: number) => ({
          id: Date.now() + idx,
          name: lang.name,
          proficiency: lang.proficiency,
          mandatory: lang.mandatory || false,
        }))
      : [{ id: 1, name: "English", proficiency: "Fluent", mandatory: true }]
  );

  useEffect(() => {
    // Persist languages to Redux whenever they change
    dispatch(
      updateFreelancerData({
        languages: languages.map(({ name, proficiency, mandatory }) => ({
          name,
          proficiency,
          mandatory,
        })),
      })
    );
  }, [languages, dispatch]);

  const addLanguage = () => {
    setLanguages([
      ...languages,
      { id: Date.now(), name: "", proficiency: "Conversational" },
    ]);
  };

  const removeLanguage = (id: number) => {
    setLanguages(languages.filter((lang) => lang.id !== id || lang.mandatory));
  };

  const handleChange = (id: number, field: keyof Language, value: string) => {
    setLanguages(
      languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  // Disable Next if any added language is empty
  const isNextDisabled = languages.some(
    (lang) => !lang.mandatory && lang.name.trim() === ""
  );

  const selectedNames = languages.map((lang) => lang.name).filter(Boolean);

  return (
    <div>
      <p className="text-gray-500">6/9</p>
      <h2 className="text-2xl font-semibold mb-2">
        Looking good. Next, tell us which languages you speak.
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Skill Club is global, so clients are often interested to know what
        languages you speak. English is a must, but do you speak any other
        languages?
      </p>

      <div className="w-full max-w-2xl p-4">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center justify-between mb-3 bg-[#F5F5F5] p-3 rounded-lg"
          >
            <select
              value={lang.name}
              onChange={(e) => handleChange(lang.id, "name", e.target.value)}
              className={`p-2 rounded border border-gray-300 w-1/2 ${
                lang.mandatory ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              disabled={lang.mandatory}
            >
              {lang.mandatory ? (
                <option value="English">English</option>
              ) : (
                <>
                  <option value="">Select Language</option>
                  {["Hindi", "Tamil", "Spanish"].map((name) => (
                    <option
                      key={name}
                      value={name}
                      disabled={selectedNames.includes(name)}
                    >
                      {name}
                    </option>
                  ))}
                </>
              )}
            </select>

            <div className="flex items-center space-x-2">
              <select
                value={lang.proficiency}
                onChange={(e) =>
                  handleChange(lang.id, "proficiency", e.target.value)
                }
                className="p-2 rounded border border-gray-300"
              >
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
              </select>

              {!lang.mandatory && (
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}

        {languages.length < 3 && (
          <button
            onClick={addLanguage}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Language
          </button>
        )}
      </div>

      <div className="flex justify-between mt-6 items-center">
        <Button content="Back" type="button" variant="secondary" onClick={onBack} />
        <Button
          content="Next"
          type="button"
          onClick={() =>
            onNext(
              languages.map(({ name, proficiency }) => ({ name, proficiency }))
            )
          }
          disabled={isNextDisabled}
        />
      </div>
    </div>
  );
}
