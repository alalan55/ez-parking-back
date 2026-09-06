import { z } from "zod";

export const checkinSchema = z.object({
  collaboratorId: z.number().min(1, "Collaborator ID is required"),
  organizationId: z.number().min(1, "Organization ID is required"),
  vehiclePlate: z.string().min(1, "Vehicle plate is required"),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().optional(),
  observation: z.string().optional(),
  vehicleMark: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.number().optional(),
  vehicleColor: z.string().optional(),
  vehicleType: z.number().optional(),
  vacancyId: z.number().optional(),
});

export const checkoutSchema = z.object({
  logId: z.number().min(1, "Log ID is required"),
  exitTime: z.string().min(1, "Exit time is required"),
});
