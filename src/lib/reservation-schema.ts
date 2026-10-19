import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
  phone: z.string().trim().regex(/^[+0-9 ()-]{7,20}$/, "Please enter a valid phone number"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date").refine((d) => d >= today(), "Date cannot be in the past"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a time"),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(20, "Maximum 20 guests"),
  requests: z.string().trim().max(500, "Special requests must be under 500 characters").optional().default(""),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
