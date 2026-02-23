import { z } from "zod";
import { SignUpData } from "@/api/authApi";
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

export const emailSchema = z.string().email("Invalid email format");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[!@#$%^&*]/, "Password must contain a special character");

export const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+?[0-9]{10,15}$/,
    "Phone number must be 10–15 digits and can start with +"
  );

//signup validation
export const handleSignUpSubmit = (
  e: React.FormEvent,
  formData: SignUpData,
  setErrors: React.Dispatch<React.SetStateAction<SignUpData>>
) => {
  e.preventDefault();

  const newErrors: Record<string, string | null> = {};
  const firstNameError = nameSchema.safeParse(formData.firstName);
  const lastNameError = nameSchema.safeParse(formData.lastName);
  const emailError = emailSchema.safeParse(formData.email);
  const passwordError = passwordSchema.safeParse(formData.password);
  const phoneError = phoneSchema.safeParse(formData.phone);
  if (!firstNameError.success) {
    newErrors.firstName = firstNameError.error.issues[0].message;
  }

  if (!lastNameError.success) {
    newErrors.lastName = lastNameError.error.issues[0].message;
  }

  if (!emailError.success) {
    newErrors.email = emailError.error.issues[0].message;
  }

  if (!passwordError.success) {
    newErrors.password = passwordError.error.issues[0].message;
  }

  if (!phoneError.success) {
    newErrors.phone = phoneError.error.issues[0].message;
  }

  if (!formData.agreement) {
    newErrors.agreement = "You must agree to the terms to continue.";
  }

  setErrors((prev) => ({ ...prev, ...newErrors }));

  if (Object.keys(newErrors).length === 0) return true;
  return false;
};

export const categorySchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z
    .enum(["list", "unlist"])
    .refine((val) => ["list", "unlist"].includes(val), {
      message: "Enter a proper value",
    }),
});

export const specialitySchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters long"),

  category: z.string().nonempty("Category is required"),

  status: z
    .enum(["list", "unlist"])
    .refine((val) => ["list", "unlist"].includes(val), {
      message: "Enter a proper value",
    }),
});

export const skillSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters long"),

  specialties: z
    .array(z.string().nonempty("Specialty ID is required"))
    .min(1, "Select at least one specialty"),

  status: z
    .enum(["list", "unlist"])
    .refine((val) => ["list", "unlist"].includes(val), {
      message: "Enter a proper value",
    }),
});

export const addressSchema = z.object({


  address: z
    .string()
    .nonempty("Address is required")
    .min(5, "Address must be at least 5 characters long"),

  city: z
    .string()
    .nonempty("City is required")
    .min(2, "City must be at least 2 characters long"),

  state: z
    .string()
    .nonempty("State is required")
    .min(2, "State must be at least 2 characters long"),

  zip: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int("Zip must be an integer").positive("Zip must be a positive number")),
});

export const professionalRoleSchema = z.object({
  professionalRole: z
    .string()
    .nonempty("Professional Role is required")
    .min(2, "Professional Role must be at least 2 characters long"),
});

export const languageProficiencySchema = z.object({
  name: z.enum(["hindi", "tamil", "spanish"] as const, {
    message: "Select a valid language",
  }),

  proficiency: z.enum(["fluent", "conversational"] as const, {
    message: "Select a valid proficiency",
  }),
});

export const hourlyRateSchema = z.object({
  hourlyRate: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Hourly Rate must be a positive number")
  ),
});

export const descriptionSchema = z.object({
  description: z
    .string()
    .nonempty("Description is required")
    .min(100, "Description must be at least 100 characters long"),
});

export const educationSchema = z.object({
  school: z.string().min(2, "School is required"),
  degree: z.string().min(2, "Degree is required"),
  field: z.string().min(2, "Field is required"),
  startYear: z.string().min(4, "Start year is required"),
  endYear: z.string().min(4, "End year is required"),
});

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from({ length: 50 }, (_, i) => (1980 + i).toString());

export const workExperienceSchema = z
  .object({
    title: z
      .string()
      .nonempty("Title is required")
      .min(2, "Title must be at least 2 characters long"),

    company: z
      .string()
      .nonempty("Company Name is required")
      .min(2, "Company Name must be at least 2 characters long"),

    location: z
      .string()
      .nonempty("Location is required")
      .min(2, "Location must be at least 2 characters long"),

    country: z
      .string()
      .nonempty("Country is required")
      .min(2, "Country must be at least 2 characters long"),

    isCurrentRole: z.boolean().default(false),

    startMonth: z.enum(months as [string, ...string[]], {
      message: "Select a valid start month",
    }),

    startYear: z.enum(years as [string, ...string[]], {
      message: "Select a valid start year",
    }),

    endMonth: z
      .enum(months as [string, ...string[]], {
        message: "Select a valid end month",
      })
      .optional(),

    endYear: z
      .enum(years as [string, ...string[]], {
        message: "Select a valid end year",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // Require end date only if not current role
      if (!data.isCurrentRole && (!data.endMonth || !data.endYear)) {
        return false;
      }
      return true;
    },
    {
      message:
        "End month and year are required if not currently working in this role",
      path: ["endMonth"], // highlights end fields
    }
  );

export const portfolioSchema = z.object({
  title: z.string().nonempty("Project title is required"),
  description: z.string().nonempty("Description is required"),
  role: z.string().nonempty("Role is required"),
  projectUrl: z
    .string()
    .url("Invalid project URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  technologies: z.array(z.string()),
  images: z.array(z.instanceof(File).optional()),
  video: z.instanceof(File, { message: "Video is required" }),
});

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Invalid email format"),
  password: z.string().trim().nonempty("Invalid Password"),
});


export const userProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters long"),
  newPassword: z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[!@#$%^&*]/, "Password must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const userAddressSchema = z.object({

  streetAddress: z
    .string()
    .nonempty("Address is required")
    .min(5, "Address must be at least 5 characters long"),

  city: z
    .string()
    .nonempty("City is required")
    .min(2, "City must be at least 2 characters long"),

  state: z
    .string()
    .nonempty("State is required")
    .min(2, "State must be at least 2 characters long"),

  zipCode: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number().int("Zip must be an integer").positive("Zip must be a positive number")),
});


export const clientProfileSchema = z.object({
  companyName: z
    .string()
    .nonempty("Company name is required")
    .min(2, "Company name must be at least 2 characters long"),

  description: z
    .string()
    .nonempty("Description is required")
    .min(5, "Description must be at least 5 characters long"),

  website: z
    .string()
    .nonempty("Website is required")
    .url("Please enter a valid URL"),
});

export const meetingAgendaSchema = z
  .string()
  .nonempty("Agenda is required")
  .min(10, "Agenda must be at least 10 characters")
  .max(500, "Agenda must be at most 500 characters");
