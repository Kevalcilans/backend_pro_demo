/*
  Warnings:

  - You are about to drop the column `isVarified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `isVarified`,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
