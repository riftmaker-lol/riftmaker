/*
  Warnings:

  - The values [STARTED] on the enum `TournamentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_TournamentToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PlayerRole" ADD VALUE 'FILL';

-- AlterEnum
BEGIN;
CREATE TYPE "TournamentStatus_new" AS ENUM ('CREATED', 'ACCEPTING_PARTICIPANTS', 'READY', 'FINISHED');
ALTER TABLE "Tournament" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tournament" ALTER COLUMN "status" TYPE "TournamentStatus_new" USING ("status"::text::"TournamentStatus_new");
ALTER TYPE "TournamentStatus" RENAME TO "TournamentStatus_old";
ALTER TYPE "TournamentStatus_new" RENAME TO "TournamentStatus";
DROP TYPE "TournamentStatus_old";
ALTER TABLE "Tournament" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TournamentToUser" DROP CONSTRAINT "_TournamentToUser_B_fkey";

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_TournamentToUser";

-- CreateTable
CREATE TABLE "_TournamentParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_KickedPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TournamentParticipants_AB_unique" ON "_TournamentParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_TournamentParticipants_B_index" ON "_TournamentParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KickedPlayers_AB_unique" ON "_KickedPlayers"("A", "B");

-- CreateIndex
CREATE INDEX "_KickedPlayers_B_index" ON "_KickedPlayers"("B");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentParticipants" ADD CONSTRAINT "_TournamentParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TournamentParticipants" ADD CONSTRAINT "_TournamentParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KickedPlayers" ADD CONSTRAINT "_KickedPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KickedPlayers" ADD CONSTRAINT "_KickedPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
