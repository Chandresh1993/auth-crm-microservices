import AppError from "../utils/AppError.js";

export const verifyWebhook = (req, res, next) => {
  const secret = req.headers["x-webhook-secret"];

  if (!secret) {
    return next(new AppError("Webhook secret missing", 401));
  }

  if (secret !== process.env.CRM_WEBHOOK_SECRET) {
    return next(new AppError("Invalid webhook secret", 403));
  }

  next();
};
