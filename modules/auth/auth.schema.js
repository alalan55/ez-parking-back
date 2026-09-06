import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  organizationName: z.string().min(1, "Organization name is required"),
  organizationEmail: z.string().email("Invalid organization email format").optional(),
  organizationAddress: z.string().optional(),
  organizationPhone: z.string().optional(),
  organizationVacanciesQuantity: z.coerce.number().min(0, "Vacancies quantity is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
