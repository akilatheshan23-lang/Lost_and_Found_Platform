const FoundItem = require("../Model/FoundItemModel");
const SocialPost = require("../Model/SocialPostModel");
const MarketplaceItem = require("../Model/MarketplaceItemModel");
const User = require("../Model/UserModel");

exports.getPending = async (req, res) => {
  try {
    const found = await FoundItem.find({ status: "pending" }).sort({ createdAt: -1 });
    const social = await SocialPost.find({ status: "pending" }).sort({ createdAt: -1 });
    const marketplace = await MarketplaceItem.find({ isApproved: false }).sort({ createdAt: -1 });
    res.status(200).json({ found, social, marketplace });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending items", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    // Count only active users for admin stats; also provide deleted count
    const usersActive = await User.countDocuments({ isActive: { $ne: false } });
    const usersDeleted = await User.countDocuments({ isActive: false });

    const [foundTotal, foundApproved, foundPending, foundHidden, foundClaimed] = await Promise.all([
      FoundItem.countDocuments(),
      FoundItem.countDocuments({ status: "approved" }),
      FoundItem.countDocuments({ status: "pending" }),
      FoundItem.countDocuments({ hidden: true }),
      FoundItem.countDocuments({ isClaimed: true }),
    ]);

    const [socialTotal, socialPending, socialHidden] = await Promise.all([
      SocialPost.countDocuments(),
      SocialPost.countDocuments({ status: "pending" }),
      SocialPost.countDocuments({ hidden: true }),
    ]);

    const [marketplaceTotal, marketplacePending] = await Promise.all([
      MarketplaceItem.countDocuments(),
      MarketplaceItem.countDocuments({ isApproved: false }),
    ]);

    const recentFound = await FoundItem.find().sort({ createdAt: -1 }).limit(5);
    const recentSocial = await SocialPost.find().sort({ createdAt: -1 }).limit(5);
    const recentMarketplace = await MarketplaceItem.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      counts: {
        users: usersActive,
        deletedUsers: usersDeleted,
        found: {
          total: foundTotal,
          approved: foundApproved,
          pending: foundPending,
          hidden: foundHidden,
          claimed: foundClaimed,
        },
        social: {
          total: socialTotal,
          pending: socialPending,
          hidden: socialHidden,
        },
        marketplace: {
          total: marketplaceTotal,
          pending: marketplacePending,
        }
      },
      recent: {
        found: recentFound,
        social: recentSocial,
        marketplace: recentMarketplace,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

exports.approveFound = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.status(200).json({ message: "Approved successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error approving", error: error.message });
  }
};

exports.rejectFound = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", adminNote: req.body.note || "" },
      { new: true }
    );
    res.status(200).json({ message: "Rejected successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting", error: error.message });
  }
};

exports.toggleHideFound = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    item.hidden = !item.hidden;
    await item.save();
    res.status(200).json({ message: "Visibility toggled", hidden: item.hidden });
  } catch (error) {
    res.status(500).json({ message: "Error toggling visibility", error: error.message });
  }
};

exports.updateFoundImage = async (req, res) => {
  try {
    const { imageUrl, imageData } = req.body;
    const item = await FoundItem.findByIdAndUpdate(req.params.id, { imageUrl, imageData }, { new: true });
    res.status(200).json({ message: "Image updated", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating image", error: error.message });
  }
};

exports.deleteFound = async (req, res) => {
  try {
    await FoundItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
};

exports.approveSocial = async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    res.status(200).json({ message: "Approved successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error approving", error: error.message });
  }
};

exports.rejectSocial = async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json({ message: "Rejected successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting", error: error.message });
  }
};

exports.toggleHideSocial = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    post.hidden = !post.hidden;
    await post.save();
    res.status(200).json({ message: "Visibility toggled", hidden: post.hidden });
  } catch (error) {
    res.status(500).json({ message: "Error toggling visibility", error: error.message });
  }
};

exports.approveMarketplace = async (req, res) => {
  try {
    const item = await MarketplaceItem.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ message: "Approved successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error approving", error: error.message });
  }
};

exports.rejectMarketplace = async (req, res) => {
  try {
    // If rejected, we simply delete the pending listing
    await MarketplaceItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Rejected and deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting", error: error.message });
  }
};
