/*
  Warnings:

  - The values [manageu] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('admin', 'manager', 'user');
ALTER TABLE "User" ALTER COLUMN "accessRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "accessRole" TYPE "Role_new" USING ("accessRole"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "accessRole" SET DEFAULT 'user';
COMMIT;
