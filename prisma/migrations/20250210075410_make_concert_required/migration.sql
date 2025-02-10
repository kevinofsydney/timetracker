/*
  Warnings:

  - Added the required column `concert` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeEntry" ADD COLUMN     "concert" TEXT NOT NULL,
ALTER COLUMN "shiftType" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
