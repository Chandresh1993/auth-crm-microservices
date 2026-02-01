import AppError from "../utils/AppError.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.error(" CRM ERROR:", err);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    details: null,
  });
};
