import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";

export const attachUser = async (req, res, next) => {
  try {
    console.log(" attachUser middleware hit");

    if (!req.user || !req.user.userId) {
      throw new AppError("Invalid token payload", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        accessRole: true,
      },
    });

    console.log("📦 User fetched from DB:", user);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user.role = user.accessRole;

    console.log("Role attached to req.user:", req.user);

    next();
  } catch (err) {
    next(err);
  }
};
