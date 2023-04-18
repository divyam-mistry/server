import express from "express";
import { captionSuggestions } from "../controllers/helpers.js"; 
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/captions/generate", verifyToken, captionSuggestions);

export default router;