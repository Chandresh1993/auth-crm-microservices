import express from "express";
import dotenv from "dotenv";
import crmRoutes from "./routes/crm.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

app.options("*", cors());

app.use(express.json());

app.use("/crm", crmRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

export default app;
