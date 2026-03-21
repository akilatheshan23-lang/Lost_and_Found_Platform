import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listMyNotifications, markAllRead } from "../controllers/notifications.controller.js";

const r = Router();
r.get("/", auth, listMyNotifications);
r.post("/read-all", auth, markAllRead);
export default r;