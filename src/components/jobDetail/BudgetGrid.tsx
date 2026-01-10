import React from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { Budget } from "@/types/interfaces/jobDetail";

interface Props {
  budget?: Budget;
}

export const BudgetGrid: React.FC<Props> = ({ budget }) => {
  if (!budget) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 pb-3 border-b border-gray-100">
          Budget & Timeline
        </h2>

        {/* Rate Type Badge */}
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-lg ${
            budget.rateType === "hourly"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {budget.rateType === "hourly" ? "Hourly Rate" : "Fixed Price"}
        </span>
      </div>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          budget.rateType === "fixed" ? "lg:grid-cols-2" : "lg:grid-cols-4"
        } gap-4`}
      >
        {/* Minimum Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center text-blue-700 text-sm mb-2">
            <span className="mr-2 text-gray-700">₹</span>
            Minimum Rate
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{budget.min ?? 0}</p>
          {budget.rateType === "hourly" && (
            <p className="text-xs text-gray-600 mt-1">per hour</p>
          )}
        </div>

        {/* Maximum Rate */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center text-green-700 text-sm mb-2">
            <span className="mr-2 text-gray-700">₹</span>
            Maximum Rate
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{budget.max ?? 0}</p>
          {budget.rateType === "hourly" && (
            <p className="text-xs text-gray-600 mt-1">per hour</p>
          )}
        </div>

        {/* Weekly Hours (only for hourly) */}
        {budget.rateType === "hourly" && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center text-purple-700 text-sm mb-2">
              <FaClock className="w-4 h-4 mr-2" />
              Weekly Hours
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {budget.hoursPerWeek ?? 0}
            </p>
            <p className="text-xs text-gray-600 mt-1">hours per week</p>
          </div>
        )}

        {/* Duration (only for hourly) */}
        {budget.rateType === "hourly" && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center text-orange-700 text-sm mb-2">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              Duration
            </div>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {budget.estimatedDuration ?? "N/A"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default BudgetGrid;
