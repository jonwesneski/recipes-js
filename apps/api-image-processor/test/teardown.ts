import { prisma } from '@repo/database';
import { StartedKafkaContainer } from '@testcontainers/kafka';
import { StartedTestContainer } from 'testcontainers';

export default async function teardownDb() {
  await prisma.$disconnect();

  if (global.postgresContainer) {
    const postgresContainer = global.postgresContainer as StartedTestContainer;
    await postgresContainer.stop();
  }

  if (global.zookeeperContainer) {
    const zookeeperContainer =
      global.zookeeperContainer as StartedTestContainer;
    await zookeeperContainer.stop();
  }

  if (global.kafkaContainer) {
    const kafkaContainer = global.kafkaContainer as StartedKafkaContainer;
    await kafkaContainer.stop();
  }
}
