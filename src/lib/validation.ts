import { z } from 'zod';

export const BUDGET_OPTIONS = [
  'Under ₹5,000',
  '₹5,000–₹10,000',
  '₹10,000–₹25,000',
  '₹25,000+',
] as const;

export const STATUS_OPTIONS = ['new', 'contacted', 'closed'] as const;

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be 80 characters or fewer'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(254, 'Email must be 254 characters or fewer'),
  budgetRange: z.enum(BUDGET_OPTIONS, {
    error: 'Please select a budget range',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be 1,000 characters or fewer'),
});

export const updateStatusSchema = z.object({
  status: z.enum(STATUS_OPTIONS, {
    error: 'Status must be new, contacted, or closed',
  }),
});

export type CreateLeadSchema = z.infer<typeof createLeadSchema>;
export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;
