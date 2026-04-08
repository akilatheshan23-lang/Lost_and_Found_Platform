const Claim = require("../Model/ClaimModel");
const FoundItem = require("../Model/FoundItemModel");
const Notification = require("../Model/NotificationModel");
const { buildApprovalPdf } = require("../utils/pdfUtils");
const { sendApprovalEmail } = require("../utils/emailUtils");

function normalizeText(value) {
  return (value || "").toString().trim();
}

function validateClaimPayload(body) {
  const required = [
    "claimItemId",
    "claimedBy",
    "userEmail",
    "userPhone",
    "claimDate",
    "claimPlace",
    "claimTime",
    "claimCategory",
    "itemType",
    "itemName",
    "itemColor",
    "authorizationDetails",
  ];

  for (const field of required) {
    if (!normalizeText(body[field])) {
      return `${field} is required`;
    }
  }

  const itemType = normalizeText(body.itemType).toLowerCase();
  if (itemType === "mobile") {
    if (!normalizeText(body.phoneNumber)) return "phoneNumber is required for mobile claims";
    if (!normalizeText(body.imeiNumber)) return "imeiNumber is required for mobile claims";
  }
  if (itemType === "laptop" && !normalizeText(body.laptopContactNumber)) {
    return "laptopContactNumber is required for laptop claims";
  }
  if (itemType === "book" && !normalizeText(body.bookColor || body.itemColor)) {
    return "bookColor is required for book claims";
  }
  if (itemType === "bag" && !normalizeText(body.bagColor || body.itemColor)) {
    return "bagColor is required for bag claims";
  }

  return "";
}

async function enrichClaim(claimId) {
  return Claim.findById(claimId).populate("claimItem");
}

exports.getClaims = async (req, res) => {
  try {
    const filter = {};
    if (req.user && req.user.role !== "admin") {
      filter.claimedByAccount = req.user.id;
    }
    const claims = await Claim.find(filter)
      .populate("claimItem", "title description imageUrl itemName location Date")
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims.", error: error.message });
  }
};

exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("claimItem");
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claim", error: error.message });
  }
};

exports.submitClaim = async (req, res) => {
  try {
    const validationError = validateClaimPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const {
      claimItemId,
      claimedBy,
      userEmail,
      userPhone,
      claimDate,
      claimPlace,
      claimTime,
      claimCategory,
      itemType,
      itemName,
      itemColor,
      authorizationDetails,
      phoneNumber,
      imeiNumber,
      laptopContactNumber,
      bookColor,
      bagColor,
    } = req.body;

    const item = await FoundItem.findById(claimItemId);
    if (!item) return res.status(404).json({ message: "Found item not found" });

    if (item.status !== "approved") {
      return res.status(400).json({ message: "This item is not available for claiming yet." });
    }

    const activeClaim = await Claim.findOne({
      claimItem: claimItemId,
      status: { $in: ["pending", "approved", "collected"] },
    });

    if (activeClaim) {
      return res.status(400).json({ message: "An active claim already exists for this item." });
    }

    const claim = await Claim.create({
      claimItem: claimItemId,
      claimedByAccount: req.user ? req.user.id : null,
      claimedBy: normalizeText(claimedBy),
      userEmail: normalizeText(userEmail),
      userPhone: normalizeText(userPhone),
      claimDate,
      claimPlace: normalizeText(claimPlace),
      claimTime,
      claimCategory,
      itemType,
      itemName: normalizeText(itemName),
      itemColor: normalizeText(itemColor),
      authorizationDetails: normalizeText(authorizationDetails),
      phoneNumber: normalizeText(phoneNumber),
      imeiNumber: normalizeText(imeiNumber),
      laptopContactNumber: normalizeText(laptopContactNumber),
      bookColor: normalizeText(bookColor),
      bagColor: normalizeText(bagColor),
      status: "pending",
      adminNote: "",
      approvalNotification: "Claim submitted and sent to admin for review.",
    });

    const populated = await enrichClaim(claim._id);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["pending", "approved", "rejected", "collected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const claim = await Claim.findById(req.params.id).populate("claimItem");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (status === "collected" && claim.status !== "approved") {
      return res.status(400).json({ message: "Only approved claims can be marked as collected." });
    }

    claim.status = status;
    claim.adminNote = normalizeText(adminNote);

    if (status === "approved") {
      claim.approvedAt = new Date();
      claim.rejectedAt = null;
      claim.collectedAt = null;
      claim.approvalNotification = "Your claim has been approved. The item can be collected from security.";

      // Automatically mark the item as claimed in FoundItemModel
      await FoundItem.findByIdAndUpdate(claim.claimItem._id, { isClaimed: true, claimedBy: claim.claimedByAccount });

      const pdfBuffer = await buildApprovalPdf(claim);
      const filename = `claim-approval-${String(claim._id).slice(0, 8)}.pdf`;
      const mailResult = await sendApprovalEmail({
        to: claim.userEmail,
        claim,
        pdfBuffer,
        filename,
      });

      claim.emailSentAt = new Date();
      claim.emailFallbackPath = mailResult.fallbackPath || "";

      // Notify through internal notification
      await Notification.create({
        recipient: claim.claimedByAccount,
        senderName: "Admin",
        message: "Your claim has been approved! Please collect it.",
        type: "claim"
      });
    }

    if (status === "rejected") {
      claim.rejectedAt = new Date();
      claim.approvedAt = null;
      claim.collectedAt = null;
      claim.approvalNotification = "Your claim was rejected by admin review.";
      claim.emailFallbackPath = "";
    }

    if (status === "pending") {
      claim.approvedAt = null;
      claim.rejectedAt = null;
      claim.collectedAt = null;
      claim.approvalNotification = "Claim submitted and waiting for admin review.";
      claim.emailFallbackPath = "";
    }

    if (status === "collected") {
      claim.collectedAt = new Date();
      claim.approvalNotification = "Item collected from main gate security and recorded in the system.";
    }

    await claim.save();
    const populated = await enrichClaim(claim._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { feedback, feedbackRating } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (!["approved", "collected"].includes(claim.status)) {
      return res.status(400).json({ message: "Feedback allowed only for approved or collected claims" });
    }

    if (!normalizeText(feedback)) {
      return res.status(400).json({ message: "Feedback is compulsory." });
    }

    claim.feedback = normalizeText(feedback);
    claim.feedbackRating = Number(feedbackRating || 0);
    claim.feedbackSubmittedAt = new Date();
    await claim.save();

    const populated = await enrichClaim(claim._id);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.downloadApprovalPdf = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("claimItem");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (!["approved", "collected"].includes(claim.status)) {
      return res.status(400).json({ message: "PDF available only for approved claims" });
    }

    const pdfBuffer = await buildApprovalPdf(claim);
    const filename = `claim-approval-${String(claim._id).slice(0, 8)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
