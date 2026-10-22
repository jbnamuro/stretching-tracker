-- AlterTable
ALTER TABLE "calendar_entries" ADD COLUMN     "completed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
