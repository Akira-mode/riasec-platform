-- Ensure Dimension enum exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Dimension') THEN
    CREATE TYPE "Dimension" AS ENUM ('R', 'I', 'A', 'S', 'E', 'C');
  END IF;
END $$;

-- CreateEnum AssessmentStatus
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AssessmentStatus') THEN
    CREATE TYPE "AssessmentStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');
  END IF;
END $$;

-- CreateTable Assessment
CREATE TABLE IF NOT EXISTS "Assessment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "AssessmentStatus" NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable AssessmentAnswer
CREATE TABLE IF NOT EXISTS "AssessmentAnswer" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "value" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable RiasecResult
CREATE TABLE IF NOT EXISTS "RiasecResult" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "scoreR" DOUBLE PRECISION NOT NULL,
  "scoreI" DOUBLE PRECISION NOT NULL,
  "scoreA" DOUBLE PRECISION NOT NULL,
  "scoreS" DOUBLE PRECISION NOT NULL,
  "scoreE" DOUBLE PRECISION NOT NULL,
  "scoreC" DOUBLE PRECISION NOT NULL,
  "normalizedR" DOUBLE PRECISION NOT NULL,
  "normalizedI" DOUBLE PRECISION NOT NULL,
  "normalizedA" DOUBLE PRECISION NOT NULL,
  "normalizedS" DOUBLE PRECISION NOT NULL,
  "normalizedE" DOUBLE PRECISION NOT NULL,
  "normalizedC" DOUBLE PRECISION NOT NULL,
  "top3" "Dimension"[] NOT NULL,
  "profileCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiasecResult_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RiasecResult_assessmentId_key" UNIQUE ("assessmentId")
);

-- AddForeignKey
ALTER TABLE "Assessment"
  ADD CONSTRAINT "Assessment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssessmentAnswer"
  ADD CONSTRAINT "AssessmentAnswer_assessmentId_fkey"
  FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AssessmentAnswer"
  ADD CONSTRAINT "AssessmentAnswer_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiasecResult"
  ADD CONSTRAINT "RiasecResult_assessmentId_fkey"
  FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
