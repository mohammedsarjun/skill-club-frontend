import z from "zod";

export const jobTitleSchema = z
  .string()
  .trim()
  .min(5, "Title must be at least 5 characters long")
  .max(100, "Title is too long")
  .refine((val) => val.trim().length > 0, {
    message: "Title cannot be empty or just spaces",
  })
  .refine((val) => !/\s{2,}/.test(val), {
    message: "Title cannot contain multiple consecutive spaces",
  });

export const SelectedSpecialitiesSchema = z
  .array(z.string())
  .min(1, { message: "Select at least one speciality." })
  .max(3, { message: "Select at most 3 specialities." });

// INR-only validation schemas for client job/offer creation

export function createHourlyBudgetSchema() {
  return z.object({
    hourlyRate: z.object({
      min: z
        .number()
        .min(500, 'Minimum hourly rate must be at least ₹500'),
      max: z
        .number()
        .min(500, 'Maximum hourly rate must be at least ₹500'),
      hoursPerWeek: z.number().min(1).max(40, 'Max 40 hours per week'),
      estimatedDuration: z.enum(['1 To 3 Months', '3 To 6 Months']),
    }).refine(
      (data) => data.max >= data.min,
      { message: 'Maximum must be greater than or equal to minimum' }
    ).refine(
      (data) => data.max <= 10000,
      { message: 'Hourly rate cannot exceed ₹10,000' }
    ),
  });
}

export function createFixedBudgetSchema() {
  return z.object({
    fixedRate: z.object({
      min: z
        .number()
        .min(500, 'Minimum budget must be at least ₹500'),
      max: z
        .number()
        .min(500, 'Maximum budget must be at least ₹500'),
    }).refine(
      (data) => data.max >= data.min,
      { message: 'Maximum must be greater than or equal to minimum' }
    ).refine(
      (data) => data.max <= 100000,
      { message: 'Budget cannot exceed ₹1,00,000' }
    ),
  });
}

export const JobDescriptionSchema = z
  .string()
  .min(50, "Description must be at least 50 characters long")
  .max(50000,"Description cannot exceed 50000 characters")
  .refine(
    (val) => val.replace(/<[^>]*>/g, "").trim().length >= 50,
    "Minimum 50 characters required"
  )
  .refine(
    (val) => !/ {2,}/.test(val.replace(/<[^>]*>/g, "")),
    "Description cannot contain excessive spaces"
  );
