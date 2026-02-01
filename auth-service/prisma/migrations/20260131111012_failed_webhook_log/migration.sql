-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- CreateTable
CREATE TABLE "FailedWebhookLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventPayload" JSONB NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "status" "status" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailedWebhookLog_pkey" PRIMARY KEY ("id")
);
