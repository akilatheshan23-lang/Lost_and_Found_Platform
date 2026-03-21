import { z } from "zod";

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
  title: z.string().min(2),
  description: z.string().min(5),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  category: z.enum(["electronics", "documents", "accessories", "clothing", "keys", "other"]),
  location: z.string().min(2),
  foundDateISO: z.string().min(8),
  userType: z.enum(["student", "staff"])
});

export const socialCreateSchema = z.object({
  postType: z.enum(["announcement", "event", "update", "general"]),
  title: z.string().min(2),
  content: z.string().min(3),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const socialUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().min(3).optional(),
  imageUrl: z.string().optional(),
  imageData: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const rejectNoteSchema = z.object({
  note: z.string().max(300).optional()
});