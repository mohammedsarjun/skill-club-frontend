import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { formatCurrency, getCurrencySymbol } from "@/utils/currency";

interface StepSevenProps {
  onBack: () => void;
  onNext: (data: { hourlyRate: number }) => void;
  savedData?: { hourlyRate?: number };
}

export default function StepSevenForm({ onBack, onNext, savedData }: StepSevenProps) {
  const [hourlyRate, setHourlyRate] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  // ✅ Restore saved hourly rate on mount
  useEffect(() => {
    if (savedData?.hourlyRate) {
      setHourlyRate(savedData.hourlyRate);
    }
  }, [savedData]);

  useEffect(() => {
    if (hourlyRate === "" || typeof hourlyRate !== 'number') { setError(""); return; }
    if (hourlyRate < 100) {
      setError('Hourly rate must be at least ₹100');
    } else if (hourlyRate > 10000) {
      setError('Hourly rate cannot exceed ₹10,000');
    } else {
      setError("");
    }
  }, [hourlyRate]);

  return (
    <div>
      <p className="text-gray-500">8/9</p>

      <h2 className="text-2xl font-semibold mb-2">
        Now, let’s set your hourly rate.
      </h2>

      <p className="text-gray-600 mb-6 text-sm">
        Clients will see this rate on your profile and in search results once
        you publish your profile. You can adjust your rate every time you submit
        a proposal.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Hourly rate</h2>

      <p className="text-gray-600 mb-6 text-sm">Total amount the client will see.</p>

      <Input
        type="number"
        value={String(hourlyRate)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setHourlyRate(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="w-1/2"
        fullWidth={false}
      />
      <p className="text-sm text-gray-600 mt-2">Currency: INR ({getCurrencySymbol()})</p>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      <div className="flex justify-between mt-6">
        <Button content="Back" type="submit" variant="secondary" onClick={onBack} />
        <Button
          content="Next"
          type="submit"
          onClick={() => onNext({ hourlyRate: Number(hourlyRate) })}
          disabled={hourlyRate === "" || Number(hourlyRate) <= 0 || !!error}
        />
      </div>
    </div>
  );
}
