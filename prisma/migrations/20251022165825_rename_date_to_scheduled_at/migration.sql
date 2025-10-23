/*
  Warnings:

  - You are about to drop the column `date` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `scheduledAt` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "date",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3);
