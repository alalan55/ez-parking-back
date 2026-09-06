import { z } from "zod";

export const createVehicleSchema = z.object({
  plate: z.string().min(1, "Plate is required").max(8, "Plate must be 8 characters or less"),
  mark: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  color: z.string().optional(),
  type: z.number().optional(),
  organizationId: z.number().min(1, "Organization ID is required"),
});

export const updateVehicleSchema = z.object({
  id: z.number().min(1, "ID is required"),
  plate: z.string().min(1, "Plate is required").max(8, "Plate must be 8 characters or less"),
  mark: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  color: z.string().optional(),
  type: z.number().optional(),
});
