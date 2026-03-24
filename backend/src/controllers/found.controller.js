import FoundItem from "../models/FoundItem.js";
import { foundCreateSchema, getValidationMessage } from "../utils/validators.js";

export async function createFound(req, res) {
  const parsed = foundCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error, "Invalid found post data"),
      issues: parsed.error.issues,
    });
  }

  const { title, description, imageUrl, imageData, category, location, foundDateISO, userType } = parsed.data;

  const found = await FoundItem.create({
    title,
    description,
    imageUrl: imageUrl || "",
    imageData: imageData || "",
    category,
    location,
    foundDate: new Date(foundDateISO),
    userType,
    createdBy: req.user.id,
    createdByName: req.user.name,
    status: "pending",
  });

  res.status(201).json(found);
}

export async function listFoundApproved(req, res) {
  const { cursor, limit = 10, category, userType, q } = req.query;

  const filter = { status: "approved", hidden: { $ne: true } };
  if (category) filter.category = category;
  if (userType) filter.userType = userType;
  if (q) {
    const re = new RegExp(q, "i");
    filter.$or = [{ title: re }, { description: re }, { location: re }];
  }
  if (cursor) filter.createdAt = { $lt: new Date(cursor) };

  const items = await FoundItem.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
  const nextCursor = items.length ? items[items.length - 1].createdAt.toISOString() : null;

  res.json({ items, nextCursor });
}
