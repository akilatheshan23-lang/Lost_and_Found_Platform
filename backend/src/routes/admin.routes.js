import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";
import {
  listPending,
  approveFound,
  rejectFound,
  approveSocial,
  rejectSocial,
  toggleHideSocial,
  toggleHideFound,
  updateFoundImage,
  deleteFoundAdmin,
  getStats,
} from "../controllers/admin.controller.js";

const r = Router();
r.use(auth, adminOnly);

r.get("/pending", listPending);
r.get("/stats", getStats);

r.post("/found/:id/approve", approveFound);
r.post("/found/:id/reject", rejectFound);
r.post("/found/:id/toggle-hide", toggleHideFound);
r.put("/found/:id/image", updateFoundImage);
r.delete("/found/:id", deleteFoundAdmin);

r.post("/social/:id/approve", approveSocial);
r.post("/social/:id/reject", rejectSocial);
r.post("/social/:id/toggle-hide", toggleHideSocial);

export default r;