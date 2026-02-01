import express from "express";
import {
  deleteUser,
  getAllUser,
  getUSerByID,
  loginUser,
  signupUser,
  updateUser,
  getMe,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  refreshAccessToken,
  logoutUser,
} from "../controllers/userController.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
import { getLoginHistory } from "../controllers/userController.js";
import { attachUser } from "../middlewares/attachUser.js";
import { getFailedWebhookLogs } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.get(
  "/failed",
  verifyToken,
  attachUser,
  allowRoles("admin"),
  getFailedWebhookLogs,
);

router.post(
  "/logout",
  verifyToken,
  attachUser,
  allowRoles("admin", "manager", "user"),
  logoutUser,
);

router.get(
  "/me",
  verifyToken,
  attachUser,
  allowRoles("admin", "manager", "user"),
  getMe,
);

router.get(
  "/login-history",
  verifyToken,
  attachUser,
  allowRoles("admin", "manager"),
  getLoginHistory,
);

router.get(
  "/",
  verifyToken,
  attachUser,
  allowRoles("admin", "manager"),
  getAllUser,
);

router.get(
  "/:id",
  verifyToken,
  attachUser,
  allowRoles("admin", "user"),
  getUSerByID,
);

router.patch(
  "/:id",
  verifyToken,
  attachUser,
  allowRoles("admin", "user"),
  updateUser,
);

router.delete("/:id", verifyToken, attachUser, allowRoles("admin"), deleteUser);

export default router;
