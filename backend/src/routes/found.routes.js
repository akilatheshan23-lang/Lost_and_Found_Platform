import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createFound, listFoundApproved } from "../controllers/found.controller.js";

const r = Router();
r.get("/", listFoundApproved);
r.post("/", auth, createFound);
export default r;