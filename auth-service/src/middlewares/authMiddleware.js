import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";
import AppError from "../utils/AppError.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    if (redis && redis.status === "ready") {
      const isBlocked = await redis.get(`bl:${token}`);
      if (isBlocked) {
        throw new AppError("Token revoked", 401);
      }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      next(new AppError("Invalid token", 401));
    } else if (err.name === "TokenExpiredError") {
      next(new AppError("Token expired", 401));
    } else {
      next(err);
    }
  }
};
