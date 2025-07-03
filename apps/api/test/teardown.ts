import { prisma } from '@repo/database';
import { StartedTestContainer } from 'testcontainers';

export let postgresContainer: StartedTestContainer;

export default async function teardownDb() {
  await prisma.$disconnect();

  if (global.postgresContainer) {
    postgresContainer = global.postgresContainer as StartedTestContainer;
    await postgresContainer.stop();
  }
}
