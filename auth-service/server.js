import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./src/routes/userRoutes.js";
import { globalErrorHandler } from "./src/middlewares/errorHandler.js";
import AppError from "./src/utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3020;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

app.get("/", (req, res) => {
  res.send("Auth Service is running");
});

app.use("/users", userRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
