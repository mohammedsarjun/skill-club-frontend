// ✅ Validation using Zod

import { z } from "zod";

function stringToNumber(val: unknown, fieldName: string) {
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {

      return undefined; 
    }
    return parsed;
  }
  return val;
}

// INR-only validation for freelancer proposals

export function proposalSchema(jobType: string) {
  // Use coercion to accept string inputs from form fields ("1000")
  // and convert them into numbers/dates before validation.
  if (jobType === 'hourly') {
    return z.object({
      // Accept string numbers from form inputs and coerce to number
      hourlyRate: z.preprocess((val) => {
        if (typeof val === 'string') {
          const n = Number(val);
          return Number.isNaN(n) ? val : n;
        }
        return val;
      }, z.number().min(100, 'Hourly rate must be at least ₹100').max(10000, 'Hourly rate cannot exceed ₹10,000')),
      availableHoursPerWeek: z.preprocess((val) => {
        if (typeof val === 'string') {
          const n = Number(val);
          return Number.isNaN(n) ? val : n;
        }
        return val;
      }, z.number().min(1).max(40)),
      coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
    });
  }

  return z.object({
    proposedBudget: z.preprocess((val) => {
      if (typeof val === 'string') {
        const n = Number(val);
        return Number.isNaN(n) ? val : n;
      }
      return val;
    }, z.number().min(500, 'Budget must be at least ₹500').max(100000, 'Budget cannot exceed ₹1,00,000')),
    deadline: z.preprocess((val) => {
      // Date inputs often come as strings; attempt to parse
      if (typeof val === 'string') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? val : d;
      }
      return val;
    }, z.date()),
    coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  });
}

