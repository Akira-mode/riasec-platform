-- Ensure AgeBracket enum exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AgeBracket') THEN
    CREATE TYPE "AgeBracket" AS ENUM ('COLLEGIAN', 'LYCEEN', 'UNIVERSITAIRE', 'ADULTE');
  END IF;
END $$;

-- DropTable
DROP TABLE IF EXISTS "Question" CASCADE;

-- Recreate table with new structure
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "dimension" "Dimension" NOT NULL,
    "age_brackets" "AgeBracket"[] NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "difficulty" INTEGER,
    "tags" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
