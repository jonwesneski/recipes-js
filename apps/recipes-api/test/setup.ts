import { MeasurementUnit } from '@repo/database';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { GenericContainer } from 'testcontainers';
import recipesData from './recipesTestData.json';

async function getPrisma() {
  const { prisma } = await import('@repo/database');
  return prisma;
}

export default async function setupDb() {
  dotenv.config({ path: './.env.test' });

  const postgresContainer = await new GenericContainer('postgres:13')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'prisma',
      POSTGRES_PASSWORD: 'prisma',
      POSTGRES_DB: 'recipes-db',
    })
    .start();

  process.env.DATABASE_URL = `postgresql://prisma:prisma@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(5432)}/recipes-db-test?schema=public`;

  // Optional: wait a moment for the container to be ready for connections
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Run Prisma schema push (or migration deploy) to create the schema in the test database
  // Use the correct command based on your workflow. Here we use "prisma db push" to push the schema
  const dbDir = path.join(__dirname, '..', '..', '..', 'packages', 'database');
  console.log(`Running Prisma db push in directory: ${dbDir}`);
  execSync('pnpm prisma db push', {
    stdio: 'inherit',
    cwd: dbDir,
  });

  const prisma = await getPrisma();
  await prisma.$connect();
  await seedDb(prisma);

  global.postgresContainer = postgresContainer;
}

async function seedDb(prisma: Awaited<ReturnType<typeof getPrisma>>) {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      name: 'jon',
      handle: 'jon',
      email: 'j@j.com',
    },
  });

  for (const recipe of recipesData) {
    await prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description,
        imageUrl: 'url',
        steps: {
          create: recipe.steps.map((step) => ({
            instruction: step.instruction,
            ingredients: {
              createMany: {
                data: step.ingredients.map((ingredient) => ({
                  name: ingredient.name,
                  amount: ingredient.amount,
                  unit: ingredient.unit as MeasurementUnit,
                })),
              },
            },
          })),
        },
        userHandle: user.handle,
      },
    });
  }
}
