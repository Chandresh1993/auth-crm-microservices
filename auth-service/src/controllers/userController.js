import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { sendLoginEventToCRM } from "../services/webhookService.js";
import redis from "../lib/redis.js";
import { loginSchema } from "../validators/auth.schema.js";
import AppError from "../utils/AppError.js";

export const signupUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        accessRole: user.accessRole,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        accessRole: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUSerByID = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        username: true,
        email: true,
        accessRole: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json({ message: "User updated", user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });

  res.json({ message: "User deleted" });
};

// =========Login======
// export const loginUser = async (req, res, next) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   const accessToken = jwt.sign(
//     { userId: user.id, role: user.accessRole },
//     process.env.JWT_SECRET_KEY,
//     { expiresIn: "15m" },
//   );

//   const refreshToken = jwt.sign(
//     { userId: user.id },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: "7d" },
//   );

//   // await prisma.user.update({
//   //   where: { id: user.id },
//   //   data: { refreshToken },
//   // });
//   if (redis && redis.status === "ready") {
//     await redis.set(`refresh:${user.id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
//   }

//   // WEBHOOK CALL
//   await sendLoginEventToCRM({
//     userId: user.id,
//     email: user.email,
//     role: user.accessRole,
//     ip: req.ip,
//     userAgent: req.headers["user-agent"],
//     loginAt: new Date().toISOString(),
//   });

//   res.json({ accessToken, refreshToken });
// };

export const loginUser = async (req, res, next) => {
  try {
    loginSchema.parse(req.body);

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    if (redis && redis.status === "ready") {
      await redis.set(`refresh:${user.id}`, refreshToken, "EX", 604800);
    }

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        email: user.email,
        role: user.accessRole,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        loginAt: new Date(),
      },
    });

    await sendLoginEventToCRM({
      userId: user.id,
      email: user.email,
      role: user.accessRole,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      loginAt: new Date().toISOString(),
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    if (!redis || redis.status !== "ready") {
      throw new AppError("Refresh token not supported in local mode", 501);
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const redisToken = await redis.get(`refresh:${payload.userId}`);
    if (!redisToken || redisToken !== refreshToken) {
      throw new AppError("Refresh token revoked", 403);
    }

    await redis.del(`refresh:${payload.userId}`);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.accessRole },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await redis.set(
      `refresh:${user.id}`,
      newRefreshToken,
      "EX",
      7 * 24 * 60 * 60,
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (redis && token) {
      await redis.set(`bl:${token}`, "1", "EX", 900); // 15 min
      await redis.del(`refresh:${req.user.userId}`);
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        accessRole: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getLoginHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, email, role, fromDate, toDate } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {};

    if (email) {
      where.email = {
        contains: email,
        mode: "insensitive",
      };
    }

    if (role) {
      where.role = role;
    }

    if (fromDate || toDate) {
      where.loginAt = {};
      if (fromDate) {
        where.loginAt.gte = new Date(fromDate);
      }
      if (toDate) {
        where.loginAt.lte = new Date(toDate);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.loginHistory.findMany({
        where,
        orderBy: { loginAt: "desc" },
        skip,
        take: Number(limit),
        select: {
          id: true,
          email: true,
          role: true,
          ip: true,
          userAgent: true,
          loginAt: true,
        },
      }),
      prisma.loginHistory.count({ where }),
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

// ---------failedWebHooks-------

export const getFailedWebhookLogs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const [logs, total] = await Promise.all([
      prisma.failedWebhookLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.failedWebhookLog.count({ where }),
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
