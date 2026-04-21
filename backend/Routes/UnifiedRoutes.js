const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadLost, uploadMarketplace } = require("../middleware/upload");

const lostCtrl = require("../Controllers/LostItemController");
const foundCtrl = require("../Controllers/FoundItemController");
const claimCtrl = require("../Controllers/ClaimController");
const socialCtrl = require("../Controllers/SocialPostController");
const marketCtrl = require("../Controllers/MarketplaceController");
const notifCtrl = require("../Controllers/NotificationController");
const adminCtrl = require("../Controllers/AdminController");

// --- LOST ITEMS ---
router.get("/lost", lostCtrl.getLostItems);
router.get("/lost/:id", lostCtrl.getLostItemById);
router.post("/lost", auth, uploadLost.single("image"), lostCtrl.createLostItem);
router.patch("/lost/:id/status", auth, lostCtrl.updateLostStatus);

// --- FOUND ITEMS ---
router.get("/found", foundCtrl.listFoundApproved);
router.post("/found", auth, foundCtrl.createFound);
router.get("/found/scan/:token", foundCtrl.getFoundScanData);
router.get("/found/scan/:token/pdf", foundCtrl.downloadFoundScanPdf);
router.get("/found/:id/qr", auth, foundCtrl.getFoundQr);
router.get("/found/:id", foundCtrl.getFoundItemById);
router.patch("/found/:id/approve", auth, foundCtrl.approveFoundItem);
router.patch("/found/:id/reject", auth, foundCtrl.rejectFoundItem);

// --- CLAIMS (Only for Found Items) ---
router.post("/claims", auth, claimCtrl.submitClaim);
router.get("/claims", auth, claimCtrl.getClaims);
router.get("/claims/:id", auth, claimCtrl.getClaimById);
router.patch("/claims/:id/status", auth, claimCtrl.updateClaimStatus);
router.patch("/claims/:id/feedback", auth, claimCtrl.submitFeedback);
router.get("/claims/:id/document", claimCtrl.downloadApprovalPdf);

// --- SOCIAL FEED ---
router.get("/social", socialCtrl.listSocialApproved);
router.post("/social", auth, socialCtrl.createSocial);
router.put("/social/:id", auth, socialCtrl.updateSocial);
router.delete("/social/:id", auth, socialCtrl.deleteSocial);
router.post("/social/:id/like", auth, socialCtrl.likeSocial);
router.post("/social/:id/comment", auth, socialCtrl.commentSocial);
router.put("/social/:id/comment/:commentId", auth, socialCtrl.editCommentSocial);
router.delete("/social/:id/comment/:commentId", auth, socialCtrl.deleteCommentSocial);

// --- MARKETPLACE ---
router.get("/marketplace", marketCtrl.getAllMarketplaceItems);
router.post("/marketplace", auth, uploadMarketplace.single("image"), marketCtrl.createMarketplaceItem);
router.patch("/marketplace/:id/status", auth, marketCtrl.updateMarketplaceItemStatus);

// --- NOTIFICATIONS ---
router.get("/notifications", auth, notifCtrl.getNotifications);
router.patch("/notifications/:id/read", auth, notifCtrl.markAsRead);
router.patch("/notifications/read-all", auth, notifCtrl.markAllAsRead);

// --- ADMIN CONTROLS ---
router.get("/admin/pending", auth, adminCtrl.getPending);
router.get("/admin/stats", auth, adminCtrl.getStats);
router.get("/admin/faculty-stats", auth, adminCtrl.getFacultyStats);

router.post("/admin/found/:id/approve", auth, adminCtrl.approveFound);
router.post("/admin/found/:id/reject", auth, adminCtrl.rejectFound);
router.post("/admin/found/:id/toggle-hide", auth, adminCtrl.toggleHideFound);
router.put("/admin/found/:id/image", auth, adminCtrl.updateFoundImage);
router.delete("/admin/found/:id", auth, adminCtrl.deleteFound);

router.post("/admin/social/:id/approve", auth, adminCtrl.approveSocial);
router.post("/admin/social/:id/reject", auth, adminCtrl.rejectSocial);
router.post("/admin/social/:id/toggle-hide", auth, adminCtrl.toggleHideSocial);

router.post("/admin/marketplace/:id/approve", auth, adminCtrl.approveMarketplace);
router.post("/admin/marketplace/:id/reject", auth, adminCtrl.rejectMarketplace);

module.exports = router;