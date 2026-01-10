import React from "react";

interface DivSpinnerProps {
  size?: string; // e.g. "w-12 h-12"
  overlay?: boolean; // whether to show overlay background
}

const DivSpinner: React.FC<DivSpinnerProps> = ({ size = "w-12 h-12", overlay = false }) => {
  const spinner = (
    <div className={`${size} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default DivSpinner;
