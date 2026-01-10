"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { FaClock, FaMoneyBillWave } from "react-icons/fa";
import { createHourlyBudgetSchema, createFixedBudgetSchema } from "@/utils/validations/clientValidations";
import { JobData } from "@/types/interfaces/IClient";
// ============= TYPES =============

interface JobCreationStep3Props {
  step: string;
  totalSteps: string;
  setIsNextAllowed: (value: boolean) => void;
  setJobSavedData: React.Dispatch<React.SetStateAction<JobData>>;
}

// ============= INPUT COMPONENT =============

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

function Input({
  type,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`border ${
          error ? "border-red-500" : "border-gray-300"
        } px-3 py-2 rounded focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400" : "focus:ring-blue-400"
        } w-full`}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}

// ============= MAIN COMPONENT =============

function JobFormStep3({
  step,
  totalSteps,
  setIsNextAllowed,
  setJobSavedData,
}: JobCreationStep3Props) {
  const [selectedRate, setSelectedRate] = useState<"hourly" | "fixed">(
    "hourly"
  );

  const [hourlyRateForm, setHourlyRateForm] = useState({
    min: 0,
    max: 0,
    hoursPerWeek: 0,
    estimatedDuration: "1 To 3 Months" as "1 To 3 Months" | "3 To 6 Months",
  });

  const [fixedRateForm, setFixedRateForm] = useState({ min: 0, max: 0 });

  const [hourlyErrors, setHourlyErrors] = useState({
    minError: "",
    maxError: "",
    hoursPerWeekError: "",
  });

  const [fixedErrors, setFixedErrors] = useState({
    minError: "",
    maxError: "",
  });

  // Track user interactions
  const [touchedHourly, setTouchedHourly] = useState({
    min: false,
    max: false,
    hoursPerWeek: false,
  });
  const [touchedFixed, setTouchedFixed] = useState({ min: false, max: false });

  // ============= VALIDATION =============

  const validateHourlyForm = (showErrors = false) => {
    const schema = createHourlyBudgetSchema();
    // schema expects { hourlyRate: { min, max, hoursPerWeek, estimatedDuration } }
    const parsedInput = { hourlyRate: hourlyRateForm };
    const result = schema.safeParse(parsedInput);
    const errors = { minError: "", maxError: "", hoursPerWeekError: "" };

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[issue.path.length - 1] ?? "");
        if (field === "min") errors.minError = issue.message;
        if (field === "max") errors.maxError = issue.message;
        if (field === "hoursPerWeek") errors.hoursPerWeekError = issue.message;
      }
    }

    if (showErrors) setHourlyErrors(errors);

    return result.success;
  };

  const validateFixedForm = (showErrors = false) => {
    const schema = createFixedBudgetSchema();
    // schema expects { fixedRate: { min, max } }
    const parsedInput = { fixedRate: fixedRateForm };
    const result = schema.safeParse(parsedInput);
    const errors = { minError: "", maxError: "" };

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[issue.path.length - 1] ?? "");
        if (field === "min") errors.minError = issue.message;
        if (field === "max") errors.maxError = issue.message;
      }
    }

    if (showErrors) setFixedErrors(errors);

    return result.success;
  };

  // ============= AUTO VALIDATION FOR “NEXT” =============
  useEffect(() => {
    let isValid = false;

    if (selectedRate === "hourly") {
      isValid = validateHourlyForm();
      if (isValid)
        setJobSavedData((prev) => ({
          ...prev,
          rateType: "hourly",
          hourlyRate: hourlyRateForm,
        }));
    } else {
      isValid = validateFixedForm();
      if (isValid)
        setJobSavedData((prev) => ({
          ...prev,
          rateType: "fixed",
          fixedRate: fixedRateForm,
        }));
    }

    setIsNextAllowed(isValid);
  }, [selectedRate, hourlyRateForm, fixedRateForm]);

  useEffect(() => {
    const savedData = sessionStorage.getItem("jobSavedData");
    if (!savedData) return;

    const parsedSavedData: JobData = JSON.parse(savedData);

    if (parsedSavedData.rateType) {
      setSelectedRate(parsedSavedData.rateType);
    }

    if (parsedSavedData.rateType == "hourly") {
      setHourlyRateForm({
        min: parsedSavedData.hourlyRate?.min
          ? parsedSavedData.hourlyRate?.min
          : 0,
        max: parsedSavedData.hourlyRate?.max
          ? parsedSavedData.hourlyRate?.max
          : 0,
        hoursPerWeek: parsedSavedData.hourlyRate?.hoursPerWeek
          ? parsedSavedData.hourlyRate?.hoursPerWeek
          : 0,
        estimatedDuration: parsedSavedData.hourlyRate?.estimatedDuration
          ? parsedSavedData.hourlyRate?.estimatedDuration
          : "1 To 3 Months",
      });
    }

    if(parsedSavedData.rateType=="fixed"){
      setFixedRateForm({
        min:parsedSavedData.fixedRate?.min||0,
        max:parsedSavedData.fixedRate?.max||0
      })
    }
  }, []);

  // ============= RENDER =============

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 p-6">
      {/* Left Side */}
      <div className="w-full md:w-1/2 space-y-6">
        <p className="text-gray-500">{`${step}/${totalSteps}`}</p>
        <h2 className="text-4xl font-bold">Tell us about your budget.</h2>
        <p className="text-md text-gray-600">
          This will help us match you to talent within your range.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 space-y-6 mt-6 md:mt-0">
        {/* Rate Type Selector */}
        <div className="flex space-x-3">
          <div
            className={`border w-[180px] p-4 rounded-md space-y-4 cursor-pointer transition-all ${
              selectedRate === "hourly"
                ? "border-green-600 bg-green-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedRate("hourly")}
          >
            <div className="flex gap-2 justify-between items-center">
              <FaClock className="text-gray-600 text-xl" />
              <input
                type="radio"
                name="rateType"
                checked={selectedRate === "hourly"}
                onChange={() => setSelectedRate("hourly")}
                className="accent-green-600"
              />
            </div>
            <p className="text-sm font-medium">Hourly Rate</p>
          </div>

          <div
            className={`border w-[180px] p-4 rounded-md space-y-4 cursor-pointer transition-all ${
              selectedRate === "fixed"
                ? "border-green-600 bg-green-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedRate("fixed")}
          >
            <div className="flex gap-2 justify-between items-center">
              <FaMoneyBillWave className="text-gray-600 text-xl" />
              <input
                type="radio"
                name="rateType"
                checked={selectedRate === "fixed"}
                onChange={() => setSelectedRate("fixed")}
                className="accent-green-600"
              />
            </div>
            <p className="text-sm font-medium">Fixed Payment</p>
          </div>
        </div>

        {/* Hourly Section */}
        {selectedRate === "hourly" && (
          <div className="space-y-4">
            <b className="text-lg">Hourly Rate</b>
            <div className="flex space-x-4 items-start mt-3">
              <Input
                type="number"
                placeholder="₹500"
                value={hourlyRateForm.min ? String(hourlyRateForm.min) : ""}
                error={touchedHourly.min ? hourlyErrors.minError : ""}
                onChange={(e) =>
                  setHourlyRateForm((prev) => ({
                    ...prev,
                    min: e.target.value ? Number(e.target.value) : 0,
                  }))
                }
                onBlur={() => {
                  setTouchedHourly((prev) => ({ ...prev, min: true }));
                  validateHourlyForm(true);
                }}
              />
              <p className="mt-2">To</p>
              <Input
                type="number"
                placeholder="₹1,000"
                value={hourlyRateForm.max ? String(hourlyRateForm.max) : ""}
                error={touchedHourly.max ? hourlyErrors.maxError : ""}
                onChange={(e) =>
                  setHourlyRateForm((prev) => ({
                    ...prev,
                    max: e.target.value ? Number(e.target.value) : 0,
                  }))
                }
                onBlur={() => {
                  setTouchedHourly((prev) => ({ ...prev, max: true }));
                  validateHourlyForm(true);
                }}
              />
            </div>

            <div className="flex space-x-4 items-start mt-4">
              <div className="flex-1">
                <b className="text-sm">Hours Per Week</b>
                <Input
                  type="number"
                  placeholder="Ex: 20"
                  value={
                    hourlyRateForm.hoursPerWeek
                      ? String(hourlyRateForm.hoursPerWeek)
                      : ""
                  }
                  error={
                    touchedHourly.hoursPerWeek
                      ? hourlyErrors.hoursPerWeekError
                      : ""
                  }
                  onChange={(e) =>
                    setHourlyRateForm((prev) => ({
                      ...prev,
                      hoursPerWeek: e.target.value ? Number(e.target.value) : 0,
                    }))
                  }
                  onBlur={() => {
                    setTouchedHourly((prev) => ({
                      ...prev,
                      hoursPerWeek: true,
                    }));
                    validateHourlyForm(true);
                  }}
                />
              </div>

              <div className="flex flex-col flex-1">
                <b className="text-sm mb-1">Est Duration</b>
                <select
                  className="border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full rounded"
                  value={hourlyRateForm.estimatedDuration}
                  onChange={(e) =>
                    setHourlyRateForm((prev) => ({
                      ...prev,
                      estimatedDuration: e.target.value as
                        | "1 To 3 Months"
                        | "3 To 6 Months",
                    }))
                  }
                >
                  <option value="1 To 3 Months">1 to 3 Months</option>
                  <option value="3 To 6 Months">3 to 6 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Section */}
        {selectedRate === "fixed" && (
          <div className="space-y-4">
            <b className="text-lg">Fixed Rate</b>
            <div className="flex space-x-4 items-start mt-3">
              <Input
                type="number"
                placeholder="₹500"
                value={fixedRateForm.min ? String(fixedRateForm.min) : ""}
                error={touchedFixed.min ? fixedErrors.minError : ""}
                onChange={(e) =>
                  setFixedRateForm((prev) => ({
                    ...prev,
                    min: e.target.value ? Number(e.target.value) : 0,
                  }))
                }
                onBlur={() => {
                  setTouchedFixed((prev) => ({ ...prev, min: true }));
                  validateFixedForm(true);
                }}
              />
              <p className="mt-2">To</p>
              <Input
                type="number"
                placeholder="₹1,00,000"
                value={fixedRateForm.max ? String(fixedRateForm.max) : ""}
                error={touchedFixed.max ? fixedErrors.maxError : ""}
                onChange={(e) =>
                  setFixedRateForm((prev) => ({
                    ...prev,
                    max: e.target.value ? Number(e.target.value) : 0,
                  }))
                }
                onBlur={() => {
                  setTouchedFixed((prev) => ({ ...prev, max: true }));
                  validateFixedForm(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobFormStep3;
