-- AlterTable
ALTER TABLE "results" ADD COLUMN     "secondPlaceDivisionId" TEXT,
ADD COLUMN     "thirdPlaceDivisionId" TEXT;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_secondPlaceDivisionId_fkey" FOREIGN KEY ("secondPlaceDivisionId") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_thirdPlaceDivisionId_fkey" FOREIGN KEY ("thirdPlaceDivisionId") REFERENCES "divisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
