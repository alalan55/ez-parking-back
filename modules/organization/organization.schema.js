import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
  vacanciesQuantity: z.number().min(0, "Vacancies quantity is required"),
});

export const updateOrganizationSchema = z.object({
  id: z.number().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  logo: z.string().optional(),
  vacanciesQuantity: z.number().min(0, "Vacancies quantity is required"),
});
