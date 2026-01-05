import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  organizationId: z.number().min(1, "Organization ID is required"),
});

export const createUserWithVehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  plate: z.string().min(1, "Plate is required"),
  mark: z.string().min(1, "Mark is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1, "Year is required"),
  color: z.string().optional(),
  type: z.number().min(0, "Type is required"),
  organizationId: z.number().min(1, "Organization ID is required"),
});

export const addVehicleSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  plate: z
    .string()
    .min(1, "Plate is required")
    .max(8, "Plate must be 8 characters or less"),
  mark: z.string().min(1, "Mark is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1, "Year is required"),
  color: z.string().optional(),
  type: z.number().min(0, "Type is required"),
  organizationId: z.number().min(1, "Organization ID is required"),
});

export const removeVehicleSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  vehicleId: z.number().min(1, "Vehicle ID is required"),
});
