import { z } from 'zod';

export const cancelContractSchema = z.object({
  reasonCode: z.string().min(1, 'Please select a cancellation reason'),
  description: z.string().min(10, 'Please provide at least 10 characters describing the issue').max(500, 'Description must be less than 500 characters'),
});

export type CancelContractFormData = z.infer<typeof cancelContractSchema>;
