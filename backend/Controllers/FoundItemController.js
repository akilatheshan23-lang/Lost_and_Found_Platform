const FoundItem = require("../Model/FoundItemModel");
const Notification = require("../Model/NotificationModel");
const User = require("../Model/UserModel");
const { foundCreateSchema, getValidationMessage } = require("../utils/validators");

exports.createFound = async (req, res) => {
  const parsed = foundCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error, "Invalid found post data"),
      issues: parsed.error.issues,
    });
  }

  const { title, description, imageUrl, imageData, category, location, foundDateISO, userType } = parsed.data;

  try {
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
      createdByName: req.user.name || "User",
      status: "pending",
    });

    res.status(201).json(found);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.listFoundApproved = async (req, res) => {
  try {
    const { cursor, limit = 10, category, userType, q, byUser } = req.query;

    const filter = { hidden: { $ne: true } };
    
    // Bypass 'approved' lock if the user is explicitly requesting their own personal dashboard feed
    if (byUser) {
      filter.createdBy = byUser;
    } else {
      filter.status = "approved";
    }

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
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Found item not found." });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching found item.", error: error.message });
  }
};

exports.approveFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!item) return res.status(404).json({ message: "Found item not found." });

    await Notification.create({
      recipient: item.createdBy,
      senderName: "Admin",
      message: `Your found item report "${item.title}" has been approved.`,
      type: "found",
    });

    res.status(200).json({ message: "Found item approved." });
  } catch (error) {
    res.status(500).json({ message: "Error approving found item.", error: error.message });
  }
};

exports.rejectFoundItem = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const item = await FoundItem.findByIdAndUpdate(req.params.id, { status: "rejected", adminNote }, { new: true });
    if (!item) return res.status(404).json({ message: "Found item not found." });

    await Notification.create({
      recipient: item.createdBy,
      senderName: "Admin",
      message: `Your found item report "${item.title}" has been rejected. Note: ${adminNote}`,
      type: "found",
    });

    res.status(200).json({ message: "Found item rejected." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting found item.", error: error.message });
  }
};
