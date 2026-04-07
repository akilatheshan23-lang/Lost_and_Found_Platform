const MarketplaceItem = require("../Model/MarketplaceItemModel");

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
    const { title, description, price, category, condition, sellerName, sellerContact } = req.body;
    let finalImageUrl = req.body.imageUrl || "";

    if (req.file) {
      finalImageUrl = `/uploads/marketplace/${req.file.filename}`;
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      category,
      condition: condition || "good",
      seller: req.user ? req.user.id : req.body.seller,
      sellerName,
      sellerContact: sellerContact || "",
      imageUrl: finalImageUrl,
      status: "available",
      isApproved: req.user && req.user.role === "admin" ? true : false,
    });

    await newItem.save();

    res.status(201).json({ message: "Marketplace item submitted successfully.", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating marketplace item.", error: error.message });
  }
};

exports.updateMarketplaceItemStatus = async (req, res) => {
  try {
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
