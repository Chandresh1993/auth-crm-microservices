import prisma from "../lip/prisma.js";
import AppError from "../utils/AppError.js";

export const saveLoginEvent = async (req, res, next) => {
  try {
    const { userId, email, role, ip, userAgent, loginAt } = req.body;

    await prisma.loginHistory.create({
      data: {
        userId,
        email,
        role,
        ip,
        userAgent,
        loginAt: new Date(loginAt),
      },
    });

    res.json({ message: "Login event saved in CRM" });
  } catch (err) {
    next(err);
  }
};

export const getLoginLogs = async (req, res, next) => {
  try {
    const { email, role, fromDate, toDate, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (email) filters.email = email;
    if (role) filters.role = role;

    if (fromDate || toDate) {
      filters.loginAt = {};
      if (fromDate) filters.loginAt.gte = new Date(fromDate);
      if (toDate) filters.loginAt.lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.loginHistory.findMany({
        where: filters,
        orderBy: { loginAt: "desc" },
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.loginHistory.count({ where: filters }),
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};

export const getLoginStats = async (req, res, next) => {
  try {
    const totalLogins = await prisma.loginHistory.count();

    const uniqueUsers = await prisma.loginHistory.findMany({
      distinct: ["userId"],
      select: { userId: true },
    });

    const roleCounts = await prisma.loginHistory.groupBy({
      by: ["role"],
      _count: { role: true },
    });

    const topRoles = {};
    roleCounts.forEach((item) => {
      topRoles[item.role] = item._count.role;
    });

    res.json({
      totalLogins,
      uniqueUsers: uniqueUsers.length,
      topRoles,
    });
  } catch (err) {
    next(err);
  }
};
