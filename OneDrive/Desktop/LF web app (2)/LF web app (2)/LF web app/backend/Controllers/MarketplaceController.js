const MarketplaceItem = require("../Model/MarketplaceItemModel");
const BorrowRequest = require("../Model/BorrowRequestModel");
const MarketplaceItemRequest = require("../Model/MarketplaceItemRequestModel");
const Notification = require("../Model/NotificationModel");
const User = require("../Model/UserModel");

const isAdmin = (req) => req.user && req.user.role === "admin";
const ALLOWED_CATEGORIES = ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"];
const ALLOWED_CONDITIONS = ["new", "like-new", "good", "fair", "poor"];

function normalizeImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }

  if (raw.startsWith("www.") || /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
    return `https://${raw}`;
  }

  return raw;
}

function normalizeSriLankanMobile(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const compact = raw.replace(/[\s-]/g, "");
  const digits = compact.replace(/\D/g, "");

  if (/^07\d{8}$/.test(digits)) {
    return digits;
  }

  if (/^947\d{8}$/.test(digits)) {
    return `0${digits.slice(2)}`;
  }

  if (/^00947\d{8}$/.test(digits)) {
    return `0${digits.slice(4)}`;
  }

  return null;
}

function normalizeMarketplacePayload(body, { partial = false } = {}) {
  const normalized = {
    title: body.title !== undefined ? String(body.title).trim() : undefined,
    description: body.description !== undefined ? String(body.description).trim() : undefined,
    price: body.price !== undefined ? Number(body.price) : undefined,
    category: body.category !== undefined ? String(body.category).trim().toLowerCase() : undefined,
    condition: body.condition !== undefined ? String(body.condition).trim().toLowerCase() : undefined,
    sellerName: body.sellerName !== undefined ? String(body.sellerName).trim() : undefined,
    sellerContact: body.sellerContact !== undefined ? normalizeSriLankanMobile(body.sellerContact) : undefined,
    stockCount: body.stockCount !== undefined ? Number(body.stockCount) : undefined,
    imageUrl: body.imageUrl !== undefined ? normalizeImageUrl(body.imageUrl) : undefined,
    status: body.status !== undefined ? String(body.status).trim().toLowerCase() : undefined,
    isApproved: body.isApproved !== undefined ? body.isApproved === true || body.isApproved === "true" : undefined,
  };

  if (!partial) {
    if (!normalized.title || normalized.title.length < 3 || normalized.title.length > 80) {
      return { error: "Title must be between 3 and 80 characters." };
    }

    if (!normalized.description || normalized.description.length < 8 || normalized.description.length > 1000) {
      return { error: "Description must be between 8 and 1000 characters." };
    }

    if (!Number.isFinite(normalized.price) || normalized.price <= 0 || normalized.price > 10000000) {
      return { error: "Price must be between LKR 1 and LKR 10,000,000." };
    }

    if (!ALLOWED_CATEGORIES.includes(normalized.category)) {
      return { error: "Category is invalid." };
    }

    if (!ALLOWED_CONDITIONS.includes(normalized.condition || "good")) {
      return { error: "Condition is invalid." };
    }

    if (!normalized.sellerName || normalized.sellerName.length < 2 || normalized.sellerName.length > 60 || !/\p{L}/u.test(normalized.sellerName)) {
      return { error: "Seller name must be 2-60 characters and include letters." };
    }

    if (!normalized.sellerContact) {
      return { error: "Seller contact must be a valid Sri Lankan mobile number (07XXXXXXXX)." };
    }

    if (!Number.isInteger(normalized.stockCount) || normalized.stockCount < 1 || normalized.stockCount > 1000) {
      return { error: "Stock count must be an integer between 1 and 1000." };
    }

    if (normalized.imageUrl && !/^https?:\/\//i.test(normalized.imageUrl) && !normalized.imageUrl.startsWith("/") && !normalized.imageUrl.startsWith("data:") && !normalized.imageUrl.startsWith("blob:")) {
      return { error: "Image URL is invalid." };
    }
  }

  if (partial) {
    if (normalized.title !== undefined && (normalized.title.length < 3 || normalized.title.length > 80)) {
      return { error: "Title must be between 3 and 80 characters." };
    }
    if (normalized.description !== undefined && (normalized.description.length < 8 || normalized.description.length > 1000)) {
      return { error: "Description must be between 8 and 1000 characters." };
    }
    if (normalized.price !== undefined && (!Number.isFinite(normalized.price) || normalized.price <= 0 || normalized.price > 10000000)) {
      return { error: "Price must be between LKR 1 and LKR 10,000,000." };
    }
    if (normalized.category !== undefined && !ALLOWED_CATEGORIES.includes(normalized.category)) {
      return { error: "Category is invalid." };
    }
    if (normalized.condition !== undefined && !ALLOWED_CONDITIONS.includes(normalized.condition)) {
      return { error: "Condition is invalid." };
    }
    if (normalized.sellerName !== undefined && (!normalized.sellerName || normalized.sellerName.length < 2 || normalized.sellerName.length > 60 || !/\p{L}/u.test(normalized.sellerName))) {
      return { error: "Seller name must be 2-60 characters and include letters." };
    }
    if (body.sellerContact !== undefined && !normalized.sellerContact) {
      return { error: "Seller contact must be a valid Sri Lankan mobile number (07XXXXXXXX)." };
    }
    if (normalized.stockCount !== undefined && (!Number.isInteger(normalized.stockCount) || normalized.stockCount < 0 || normalized.stockCount > 1000)) {
      return { error: "Stock count must be an integer between 0 and 1000." };
    }
    if (normalized.imageUrl !== undefined && normalized.imageUrl && !/^https?:\/\//i.test(normalized.imageUrl) && !normalized.imageUrl.startsWith("/") && !normalized.imageUrl.startsWith("data:") && !normalized.imageUrl.startsWith("blob:")) {
      return { error: "Image URL is invalid." };
    }
  }

  return { value: normalized };
}

function normalizeItemRequestPayload(body) {
  const itemName = String(body.itemName || "").trim();
  const category = String(body.category || "").trim().toLowerCase();
  const quantity = Number(body.quantity);
  const maxBudget = Number(body.maxBudget);
  const contactNumber = normalizeSriLankanMobile(body.contactNumber);
  const note = String(body.note || "").trim();

  if (!itemName || itemName.length < 3 || itemName.length > 80) {
    return { error: "Requested item name must be between 3 and 80 characters." };
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return { error: "Category is invalid." };
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
    return { error: "Quantity must be an integer between 1 and 100." };
  }

  if (!Number.isFinite(maxBudget) || maxBudget <= 0 || maxBudget > 10000000) {
    return { error: "Max budget must be between LKR 1 and LKR 10,000,000." };
  }

  if (!contactNumber) {
    return { error: "Contact number must be a valid Sri Lankan mobile number (07XXXXXXXX)." };
  }

  if (note.length > 500) {
    return { error: "Note must be 500 characters or less." };
  }

  return {
    value: {
      itemName,
      category,
      quantity,
      maxBudget,
      contactNumber,
      note,
    },
  };
}

exports.getAllMarketplaceItems = async (req, res) => {
  try {
    const filter = { status: "available" };
    if (req.user && req.user.role !== "admin") {
      filter.isApproved = true; // Users only see approved items
    }
    const items = await MarketplaceItem.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marketplace items.", error: error.message });
  }
};

exports.createMarketplaceItem = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create marketplace listings." });
    }

    const validation = normalizeMarketplacePayload(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { title, description, price, category, condition, sellerName, sellerContact, stockCount, imageUrl } = validation.value;
    let finalImageUrl = imageUrl || "";

    if (req.file) {
      finalImageUrl = `/uploads/marketplace/${req.file.filename}`;
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      condition: condition || "good",
      seller: req.user.id,
      sellerName,
      sellerContact: sellerContact || "",
      stockCount,
      imageUrl: finalImageUrl,
      status: "available",
      isApproved: true,
    });

    await newItem.save();

    res.status(201).json({ message: "Marketplace item submitted successfully.", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating marketplace item.", error: error.message });
  }
};

exports.updateMarketplaceItemStatus = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Only admins can update marketplace item status." });
    }

    const { status, isApproved } = req.body;
    const item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { status: status || "available", isApproved: isApproved !== undefined ? isApproved : true },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json({ message: "Marketplace item updated successfully.", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating marketplace item.", error: error.message });
  }
};

exports.getAdminMarketplaceItems = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const items = await MarketplaceItem.find({})
      .populate("seller", "name email")
      .populate("borrowedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching admin marketplace items.", error: error.message });
  }
};

exports.updateMarketplaceItem = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const validation = normalizeMarketplacePayload(req.body, { partial: true });
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }
    const normalizedBody = validation.value;

    const updatableFields = [
      "title",
      "description",
      "price",
      "category",
      "condition",
      "sellerName",
      "sellerContact",
      "stockCount",
      "status",
      "isApproved",
    ];

    updatableFields.forEach((field) => {
      if (normalizedBody[field] !== undefined) {
        if (field === "price") {
          item[field] = normalizedBody[field];
          return;
        }

        if (field === "stockCount") {
          item[field] = normalizedBody[field];
          return;
        }

        if (field === "isApproved") {
          const value = normalizedBody[field];
          item[field] = value === true || value === "true";
          return;
        }

        item[field] = normalizedBody[field];
      }
    });

    if (normalizedBody.imageUrl !== undefined && !req.file) {
      item.imageUrl = normalizedBody.imageUrl;
    }

    if (item.status === "available") {
      item.borrowedBy = null;
      item.borrowedAt = null;
    }

    if (item.stockCount > 0 && item.status !== "sold") {
      item.status = "available";
    } else if (item.stockCount === 0 && item.status !== "sold") {
      item.status = "borrowed";
    }

    if (req.file) {
      item.imageUrl = `/uploads/marketplace/${req.file.filename}`;
    }

    await item.save();

    return res.status(200).json({ message: "Marketplace item updated.", item });
  } catch (error) {
    return res.status(500).json({ message: "Error updating marketplace item.", error: error.message });
  }
};

exports.deleteMarketplaceItem = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const item = await MarketplaceItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.status(200).json({ message: "Marketplace item deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting marketplace item.", error: error.message });
  }
};

exports.borrowMarketplaceItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot borrow marketplace items." });
    }

    const item = await MarketplaceItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (!item.isApproved || item.stockCount <= 0) {
      return res.status(400).json({ message: "This item is out of stock or unavailable for borrowing." });
    }

    const existingPending = await BorrowRequest.findOne({
      item: item._id,
      requester: req.user.id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(409).json({ message: "You already have a pending borrow request for this item." });
    }

    const borrowRequest = await BorrowRequest.create({
      item: item._id,
      requester: req.user.id,
      status: "pending",
    });

    const [borrower, admins] = await Promise.all([
      User.findById(req.user.id).select("name email"),
      User.find({ role: "admin" }).select("_id"),
    ]);

    if (admins.length > 0) {
      const senderName = borrower?.name || borrower?.email || "A user";
      const message = `${senderName} requested to borrow marketplace item \"${item.title}\".`;

      await Notification.insertMany(
        admins.map((admin) => ({
          recipient: admin._id,
          senderName,
          message,
          type: "marketplace",
          link: "/admin/marketplace",
        }))
      );
    }

    return res.status(201).json({ message: "Borrow request submitted successfully.", borrowRequest });
  } catch (error) {
    return res.status(500).json({ message: "Error borrowing marketplace item.", error: error.message });
  }
};

exports.getBorrowRequests = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const requests = await BorrowRequest.find({})
      .populate("item", "title price imageUrl stockCount sellerName category status")
      .populate("requester", "name email contactNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching borrow requests.", error: error.message });
  }
};

exports.createMarketplaceItemRequest = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot submit item requests." });
    }

    const validation = normalizeItemRequestPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const requestDoc = await MarketplaceItemRequest.create({
      requester: req.user.id,
      ...validation.value,
      status: "pending",
    });

    const [requester, admins] = await Promise.all([
      User.findById(req.user.id).select("name email"),
      User.find({ role: "admin" }).select("_id"),
    ]);

    if (admins.length > 0) {
      const senderName = requester?.name || requester?.email || "A user";
      const message = `${senderName} requested a new marketplace item: \"${requestDoc.itemName}\".`;
      await Notification.insertMany(
        admins.map((admin) => ({
          recipient: admin._id,
          senderName,
          message,
          type: "marketplace",
          link: "/admin/marketplace",
        }))
      );
    }

    return res.status(201).json({ message: "Item request submitted successfully.", request: requestDoc });
  } catch (error) {
    return res.status(500).json({ message: "Error submitting item request.", error: error.message });
  }
};

exports.getMarketplaceItemRequests = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const requests = await MarketplaceItemRequest.find({})
      .populate("requester", "name email contactNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching item requests.", error: error.message });
  }
};

exports.updateMarketplaceItemRequestStatus = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const status = String(req.body?.status || "").trim().toLowerCase();
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be pending, approved, or rejected." });
    }

    const requestDoc = await MarketplaceItemRequest.findById(req.params.id);
    if (!requestDoc) {
      return res.status(404).json({ message: "Item request not found." });
    }

    requestDoc.status = status;
    await requestDoc.save();

    return res.status(200).json({ message: "Item request status updated.", request: requestDoc });
  } catch (error) {
    return res.status(500).json({ message: "Error updating item request status.", error: error.message });
  }
};

exports.approveBorrowRequest = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item").populate("requester", "name email");
    if (!request) {
      return res.status(404).json({ message: "Borrow request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Borrow request has already been processed." });
    }

    const item = await MarketplaceItem.findById(request.item._id);
    if (!item) {
      return res.status(404).json({ message: "Marketplace item not found." });
    }

    if (item.stockCount <= 0) {
      request.status = "rejected";
      request.rejectedAt = new Date();
      request.adminNote = "Out of stock";
      await request.save();
      return res.status(400).json({ message: "Item is out of stock." });
    }

    item.stockCount -= 1;
    if (item.stockCount === 0) {
      item.status = "borrowed";
    }
    await item.save();

    request.status = "approved";
    request.approvedAt = new Date();
    await request.save();

    await Notification.create({
      recipient: request.requester._id,
      senderName: "Marketplace Admin",
      message: `Your borrow request for \"${item.title}\" was approved.`,
      type: "marketplace",
      link: "/marketplace",
    });

    return res.status(200).json({ message: "Borrow request approved.", request, item });
  } catch (error) {
    return res.status(500).json({ message: "Error approving borrow request.", error: error.message });
  }
};

exports.rejectBorrowRequest = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin access required." });
    }

    const request = await BorrowRequest.findById(req.params.id).populate("item").populate("requester", "name email");
    if (!request) {
      return res.status(404).json({ message: "Borrow request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Borrow request has already been processed." });
    }

    request.status = "rejected";
    request.rejectedAt = new Date();
    await request.save();

    await Notification.create({
      recipient: request.requester._id,
      senderName: "Marketplace Admin",
      message: `Your borrow request for \"${request.item?.title || "item"}\" was rejected.`,
      type: "marketplace",
      link: "/marketplace",
    });

    return res.status(200).json({ message: "Borrow request rejected.", request });
  } catch (error) {
    return res.status(500).json({ message: "Error rejecting borrow request.", error: error.message });
  }
};
