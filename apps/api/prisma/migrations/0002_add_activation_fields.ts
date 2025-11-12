import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function up() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "activationToken" TEXT,
      ADD COLUMN IF NOT EXISTS "activationExpires" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT false;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_activationToken_key"
      ON "User" ("activationToken")
      WHERE "activationToken" IS NOT NULL;
    `);
  } finally {
    await prisma.$disconnect();
  }
}

async function down() {
  try {
    await prisma.$executeRawUnsafe(`
      DROP INDEX IF EXISTS "User_activationToken_key";
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User"
      DROP COLUMN IF EXISTS "activationToken",
      DROP COLUMN IF EXISTS "activationExpires",
      DROP COLUMN IF EXISTS "isActive";
    `);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const direction = process.argv[2];

  if (direction !== 'up' && direction !== 'down') {
    console.error('Usage: ts-node migrations/0002_add_activation_fields.ts <up|down>');
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

export { up, down };
