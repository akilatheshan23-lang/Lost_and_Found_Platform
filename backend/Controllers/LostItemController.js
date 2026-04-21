const LostItem = require("../Model/LostItemModel");

exports.getLostItems = async (req, res) => {
  try {
    const { category, status, createdBy, limit } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (createdBy) filter.createdBy = createdBy;

    const items = await LostItem.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 100);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getLostItemById = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Lost item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.createLostItem = async (req, res) => {
  try {
    const {
      itemName,
      imageUrl,
      userType,
      category,
      location,
      venue,
      date,
      time,
      userName,
      userEmail,
      userPhone,
    } = req.body;

    let finalImageUrl = imageUrl || "";
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    // Associate it with the authenticated user explicitly
    const createdBy = req.user ? req.user.id : req.body.createdBy;

    const item = await LostItem.create({
      itemName,
      imageUrl: finalImageUrl,
      userType: userType || "student",
      category,
      location,
      venue,
      date,
      time,
      userName,
      userEmail,
      userPhone: userPhone || "",
      status: "pending",
      createdBy: createdBy
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateLostStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      { status, adminNote: adminNote || "" },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Lost item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
