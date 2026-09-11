import { z } from "zod";

export const createMaintenanceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title is too long."),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long."),

  roomId: z
    .string()
    .trim(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ]),

  dueDate: z
    .string()
    .trim(),

  assignedToId: z
    .string()
    .trim(),
});

export type CreateMaintenanceState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    roomId?: string[];
    priority?: string[];
    dueDate?: string[];
    assignedToId?: string[];
  };
};

export const updateMaintenanceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title is too long."),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long."),

  roomId: z
    .string()
    .trim(),

  priority: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
    "URGENT",
  ]),

  dueDate: z
    .string()
    .trim(),

  assignedToId: z
    .string()
    .trim(),
});

export type UpdateMaintenanceState = {
  success: boolean;
  message: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    roomId?: string[];
    priority?: string[];
    dueDate?: string[];
    assignedToId?: string[];
  };
};