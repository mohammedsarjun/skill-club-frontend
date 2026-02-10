export type PaymentType = "fixed" | "fixed_with_milestones" | "hourly";
export type CommunicationMethod = "chat" | "video_call" | "email" | "mixed";
export type ReportingFrequency = "daily" | "weekly" | "monthly";
export type ReportingFormat = "text_with_attachments" | "text_only" | "video";
export type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "SGD" | "JPY";

export interface MilestonePayload {
  title: string;
  amount: number; // numeric after validation
  expected_delivery: string;
  revisions?: number;
}

export interface ReferenceFilePayload {
  file_name: string;
  file_url: string; // presigned or blob for now
}

export interface ReferenceLinkPayload {
  description: string;
  link: string;
}

export interface OfferTimelineEvent {
  status: "pending" | "accepted" | "rejected" | "withdrawn" | "expired";
  at: string; // ISO timestamp
  note?: string;
}

export type OfferType = "direct" | "proposal";

export interface OfferPayload {
  // Identification / linkage
  freelancerId: string; // target freelancer
  jobId?: string; // optional for direct offers (can still link a job)
  proposalId?: string; // present for proposal based offer
  offerType: OfferType; // explicit discriminator for O/C principle strategies

  // Core details
  title: string;
  description: string;

  // Payment
  payment_type: PaymentType;
  budget?: number; // required if fixed/fixed_with_milestones
  currency?: Currency;
  hourly_rate?: number; // required if hourly
  revisions?: number;
  estimated_hours_per_week?: number;
  milestones?: MilestonePayload[];

  expected_end_date: string;
  expires_at: string;
  categoryId: string;

  reporting: {
    frequency: ReportingFrequency;
    due_time_utc: string; // HH:mm in UTC
    due_day_of_week?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    due_day_of_month?: number;
    format: ReportingFormat;
  };

  // References & links
  reference_files: ReferenceFilePayload[];
  reference_links: ReferenceLinkPayload[];

  // Status tracking
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  timeline?: OfferTimelineEvent[]; // maintained server side, optional client inclusion
}

export interface OfferFieldErrors {
  [key: string]: string; // e.g., 'title': 'Required', 'milestones.0.amount': '...' etc.
}

// Server-side Offer representation (response model)
export interface OfferMilestone {
  title: string;
  amount: number;
  expectedDelivery: string | Date;
  revisions?: number;
}

export interface OfferReferenceFile {
  fileName: string;
  fileUrl: string;
}

export interface OfferReferenceLink {
  description: string;
  link: string;
}

export interface OfferCommunication {
  preferredMethod: CommunicationMethod;
  meetingFrequency?: ReportingFrequency;
  meetingDayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  meetingDayOfMonth?: number; // 1..31 for monthly
  meetingTimeUtc?: string; // HH:mm
}

export interface OfferReporting {
  frequency: ReportingFrequency;
  dueTimeUtc: string; // HH:mm UTC
  dueDayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  dueDayOfMonth?: number; // 1..31 for monthly
  format: ReportingFormat;
}

export interface Offer {
  _id: string;
  clientId: string | { id?: string; name?: string };
  freelancerId: string | { id?: string; name?: string };
  jobId?: string;
  proposalId?: string;
  offerType: OfferType;
  title: string;
  description: string;
  paymentType: PaymentType;
  budget?: number;
  currency?: Currency;
  hourlyRate?: number;
  estimatedHoursPerWeek?: number;
  milestones?: OfferMilestone[];
  expectedStartDate?: string | Date;
  expectedEndDate: string | Date;
  category?: {
    categoryId: string;
    categoryName: string;
  };
  reporting: OfferReporting;
  referenceFiles?: OfferReferenceFile[];
  referenceLinks?: OfferReferenceLink[];
  expiresAt: string | Date;
  status: "pending" | "accepted" | "rejected" | "withdrawn" | "expired";
  timeline?: OfferTimelineEvent[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
