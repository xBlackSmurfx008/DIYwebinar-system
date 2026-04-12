import { z } from "zod";

export const eventFormatSchema = z.enum(["WEBINAR", "VIRTUAL", "HYBRID", "ONSITE"]);

export const createEventBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  format: eventFormatSchema,
  /** ISO string or datetime-local (YYYY-MM-DDTHH:mm) from the browser */
  startAt: z.string().optional(),
  endAt: z.string().optional(),
});

export type CreateEventBody = z.infer<typeof createEventBodySchema>;

export function parseOptionalDate(value: string | undefined, fallback: Date): Date {
  if (!value?.trim()) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d;
}
