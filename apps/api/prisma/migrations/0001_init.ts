import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureRoleEnum() {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        CREATE TYPE "Role" AS ENUM ('etudiant', 'coach', 'admin');
      END IF;
    END
    $$;
  `);
}

async function ensureDimensionEnum() {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Dimension') THEN
        CREATE TYPE "Dimension" AS ENUM ('R', 'I', 'A', 'S', 'E', 'C');
      END IF;
    END
    $$;
  `);
}

async function createUserTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "role" "Role" NOT NULL DEFAULT 'etudiant',
      "ageBracket" TEXT,
      "refreshTokenHash" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function createQuestionTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Question" (
      "id" TEXT PRIMARY KEY,
      "text" TEXT NOT NULL UNIQUE,
      "dimension" "Dimension" NOT NULL,
      "ageBrackets" TEXT[] NOT NULL DEFAULT '{}',
      "version" INTEGER NOT NULL DEFAULT 1,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function createOccupationTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Occupation" (
      "code" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "primaryDimension" "Dimension" NOT NULL,
      "secondaryDimension" "Dimension",
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function dropTables() {
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Occupation";');
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Question";');
  await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "User";');
}

async function dropEnums() {
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Dimension') THEN
        DROP TYPE "Dimension";
      END IF;
    END
    $$;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Role') THEN
        DROP TYPE "Role";
      END IF;
    END
    $$;
  `);
}

export async function up() {
  try {
    await ensureRoleEnum();
    await ensureDimensionEnum();
    await createUserTable();
    await createQuestionTable();
    await createOccupationTable();
  } finally {
    await prisma.$disconnect();
  }
}

export async function down() {
  try {
    await dropTables();
    await dropEnums();
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const direction = process.argv[2];

  if (direction !== 'up' && direction !== 'down') {
    console.error('Usage: ts-node migrations/0001_init.ts <up|down>');
    process.exit(1);
  }

  (direction === 'up' ? up() : down())
    .then(() => {
      console.log(`Migration ${direction} executed successfully.`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
