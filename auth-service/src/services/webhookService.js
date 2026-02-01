import axios from "axios";
import prisma from "../lib/prisma.js";

const MAX_RETRIES = 5;

export const sendLoginEventToCRM = async (payload) => {
  let attempt = 0;

  const log = await prisma.failedWebhookLog.create({
    data: {
      userId: payload.userId,
      eventPayload: payload,
      status: "PENDING",
      attemptCount: 0,
    },
  });

  while (attempt < MAX_RETRIES) {
    try {
      attempt++;

      await axios.post(process.env.CRM_WEBHOOK_URL, payload, {
        headers: {
          "x-webhook-secret": process.env.CRM_WEBHOOK_SECRET,
        },
      });

      await prisma.failedWebhookLog.update({
        where: { id: log.id },
        data: {
          status: "SUCCESS",
          attemptCount: attempt,
          lastAttemptAt: new Date(),
        },
      });

      console.log(" CRM webhook success");
      return;
    } catch (error) {
      await prisma.failedWebhookLog.update({
        where: { id: log.id },
        data: {
          attemptCount: attempt,
          lastAttemptAt: new Date(),
          errorMessage: error.message,
        },
      });

      console.log(` Attempt ${attempt} failed`);

      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  }

  await prisma.failedWebhookLog.update({
    where: { id: log.id },
    data: {
      status: "FAILED",
    },
  });

  console.log(" CRM webhook permanently failed");
};
