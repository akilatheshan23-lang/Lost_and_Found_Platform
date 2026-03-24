import { z } from "zod";

const containsLetters = (value) => /\p{L}/u.test(String(value || "").trim());

function meaningfulText(label, min) {
  return z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .refine((value) => containsLetters(value), {
      message: `${label} must include letters and cannot be only numbers`,
    });
}

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isTodayOrPastDateString(value) {
  const normalized = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) && normalized <= getTodayDateString();
}

export function getValidationMessage(error, fallback = "Invalid data") {
  const firstIssue = error?.issues?.[0];
  return firstIssue?.message || fallback;
}

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(["student", "staff"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const foundCreateSchema = z.object({
  title: meaningfulText("Item name", 2),
  description: meaningfulText("Description", 5),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  category: z.enum(["electronics", "documents", "accessories", "clothing", "keys", "other"]),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  foundDateISO: z
    .string()
    .min(8)
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Found date is invalid",
    }),
  foundDateLocal: z
    .string()
    .refine((value) => isTodayOrPastDateString(value), {
      message: "Found date cannot be a future date.",
    }),
  userType: z.enum(["student", "staff"])
});

export const socialCreateSchema = z.object({
  postType: z.enum(["announcement", "event", "update", "general"]),
  title: meaningfulText("Title", 2),
  content: meaningfulText("Content", 3),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const socialUpdateSchema = z.object({
  title: meaningfulText("Title", 2).optional(),
  content: meaningfulText("Content", 3).optional(),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const rejectNoteSchema = z.object({
  note: z.string().max(300).optional()
});