-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Manager';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "accessRole" SET DEFAULT 'User';
