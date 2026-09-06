import { z } from "zod";

export const createCollaboratorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  role: z.number().int().min(0).max(2).optional(),
  organizationId: z.number().min(1, "Organization ID is required"),
});

export const updateCollaboratorSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must have at least 6 characters").optional(),
  role: z.number().int().min(0).max(2).optional(),
  active: z.boolean().optional(),
});
