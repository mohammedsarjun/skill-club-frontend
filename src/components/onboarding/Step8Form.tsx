import React, { useState, useEffect } from "react";
import Button from "../common/Button";

interface StepSevenProps {
  onBack: () => void;
  onNext: (data: { bio: string }) => void;
  savedData?: { bio?: string }; // ✅ get saved data from Redux/persist
}

export default function StepSevenForm({ onBack, onNext, savedData }: StepSevenProps) {
  const [bio, setBio] = useState("");

  // ✅ Restore saved bio on mount
  useEffect(() => {
    if (savedData?.bio) {
      setBio(savedData.bio);
    }
  }, [savedData]);

  return (
    <div>
      <p className="text-gray-500">7/9</p>

      <h2 className="text-2xl font-semibold mb-2">
        Great. Now write a bio to tell the world about yourself.
      </h2>

      <p className="text-gray-600 mb-6 text-sm">
        Help people get to know you at a glance. What work do you do best? Tell
        them clearly, using paragraphs or bullet points. You can always edit
        later; just make sure you proofread now.
      </p>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-1/2 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your top skills, experiences, and interests. This is one of the first things clients will see on your profile."
      ></textarea>
      <p className="font-semibold text-sm">At least 100 characters</p>

      <div className="flex justify-between mt-6">
        <Button
          content="Back"
          type="submit"
          variant="secondary"
          onClick={onBack}
        />
        <Button
          content="Next"
          type="submit"
          onClick={() => onNext({ bio })}
          disabled={bio.trim().length < 100} // ✅ disable until 100 chars
        />
      </div>
    </div>
  );
}
