import { execSync } from 'child_process';
import * as path from 'path';
import { GenericContainer } from 'testcontainers';

async function getPrisma() {
  const { prisma } = await import('@repo/database');
  return prisma;
}

export default async function setupDb() {
  const postgresContainer = await new GenericContainer('postgres:13')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'prisma',
      POSTGRES_PASSWORD: 'prisma',
      POSTGRES_DB: 'recipes-db',
    })
    .start();

  process.env.DATABASE_URL = `postgresql://prisma:prisma@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/recipes-db?schema=public`;

  // Optional: wait a moment for the container to be ready for connections
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Run Prisma schema push (or migration deploy) to create the schema in the test database
  // Use the correct command based on your workflow. Here we use "prisma db push" to push the schema
  const dbDir = path.join(__dirname, '..', '..', '..', 'packages', 'database');
  execSync('pnpm prisma db push', {
    stdio: 'inherit',
    cwd: dbDir,
  });

  const prisma = await getPrisma();
  await prisma.$connect();

  global.postgresContainer = postgresContainer;
}
