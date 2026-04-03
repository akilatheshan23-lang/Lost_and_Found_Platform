const FoundItem = require("../Model/FoundItemModel");
const Notification = require("../Model/NotificationModel");
const User = require("../Model/UserModel");
const { foundCreateSchema, getValidationMessage } = require("../utils/validators");
const { buildFoundScanPdf } = require("../utils/pdfUtils");

function formatPublicItem(item) {
  return {
    id: item._id,
    title: item.title,
    foundDate: item.foundDate,
    category: item.category,
    location: item.location,
    status: item.status,
    createdByName: item.createdByName,
    qrCodeData: item.qrCodeData || "",
  };
}

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
    const creator = await User.findById(req.user.id).select("name");

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
      createdByName: creator?.name || "User",
      status: "pending",
    });

    res.status(201).json(found);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.listFoundApproved = async (req, res) => {
  try {
    const { cursor, limit = 10, category, userType, q } = req.query;

    const filter = { status: "approved", hidden: { $ne: true } };
    if (category) filter.category = category;
    if (userType) filter.userType = userType;
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [{ title: re }, { description: re }, { location: re }];
    }
    if (cursor) filter.createdAt = { $lt: new Date(cursor) };

    const items = await FoundItem.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("title description imageUrl imageData category location foundDate userType status isClaimed claimedBy createdBy createdByName createdAt updatedAt");
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

exports.getFoundQr = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Found item not found." });

    const isOwner = String(item.createdBy) === String(req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        message: "Only the user who created this found post can download its QR code.",
      });
    }

    if (item.status !== "approved" || !item.qrCodeData) {
      return res.status(400).json({ message: "QR code is available only after approval." });
    }

    return res.status(200).json({
      filename: `found-item-qr-${String(item._id).slice(-6)}.png`,
      qrCodeData: item.qrCodeData,
      scanUrl: item.qrScanUrl,
      title: item.title,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error getting QR code.", error: error.message });
  }
};

exports.getFoundScanData = async (req, res) => {
  try {
    const item = await FoundItem.findOne({ qrToken: req.params.token, status: "approved" }).select(
      "title foundDate category location status createdByName qrCodeData"
    );

    if (!item) {
      return res.status(404).json({ message: "QR record not found or no longer active." });
    }

    return res.status(200).json(formatPublicItem(item));
  } catch (error) {
    return res.status(500).json({ message: "Error loading QR details.", error: error.message });
  }
};

exports.downloadFoundScanPdf = async (req, res) => {
  try {
    const item = await FoundItem.findOne({ qrToken: req.params.token, status: "approved" }).select(
      "title foundDate category location status createdByName qrCodeData"
    );

    if (!item) {
      return res.status(404).json({ message: "QR record not found or no longer active." });
    }

    const pdfBuffer = await buildFoundScanPdf(item);
    const filename = `found-item-verification-${String(item._id).slice(-6)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: "Error generating PDF.", error: error.message });
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