import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createSocial, listSocialApproved, updateSocial, deleteSocial, likeSocial } from "../controllers/social.controller.js";

const r = Router();
r.get("/", listSocialApproved);
r.post("/", auth, createSocial);
r.put("/:id", auth, updateSocial);
r.delete("/:id", auth, deleteSocial);
r.post("/:id/like", auth, likeSocial);
export default r;