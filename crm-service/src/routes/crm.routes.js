import { Router } from "express";
import { saveLoginEvent, getLoginLogs } from "../controller/crm.controller.js";
import { getLoginStats } from "../controller/crm.controller.js";
import { verifyWebhook } from "../middleware/verifyWebhook.js";

const router = Router();

router.post("/login-event", verifyWebhook, saveLoginEvent);
router.get("/logins", getLoginLogs);
router.get("/stats", getLoginStats);

export default router;
