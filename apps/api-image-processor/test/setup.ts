import { MeasurementUnit } from '@repo/database';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

import { KafkaContainer } from '@testcontainers/kafka';
import * as path from 'path';
import { GenericContainer, Wait } from 'testcontainers';
import recipesData from './recipesTestData.json';

// async function assertMessageProducedAndConsumed(
//   container: StartedKafkaContainer,
//   additionalConfig: Partial<KafkaConfig> = {},
// ) {
//   const brokers = [`${container.getHost()}:${container.getMappedPort(9093)}`];
//   const kafka = new Kafka({
//     logLevel: logLevel.NOTHING,
//     brokers: brokers,
//     ...additionalConfig,
//   });

//   const producer = kafka.producer();
//   await producer.connect();
//   const consumer = kafka.consumer({ groupId: 'test-group' });
//   await consumer.connect();

//   await producer.send({
//     topic: 'test-topic',
//     messages: [{ value: 'test message' }],
//   });
//   await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

//   const consumedMessage = await new Promise((resolve) =>
//     consumer.run({
//       eachMessage: async ({ message }) => resolve(message.value?.toString()),
//     }),
//   );

//   if (consumedMessage !== 'test message') {
//     throw new Error('Message consumption failed');
//   }

//   await consumer.disconnect();
//   await producer.disconnect();
// }

async function getPrisma() {
  const { prisma } = await import('@repo/database');
  return prisma;
}

export default async function setupDb() {
  dotenv.config({ path: './.env.test' });
  // Unable to get testcontainers to work with colima/docker on macOS
  // process.env.DOCKER_HOST = `unix://${process.env.HOME}/.colima/default/docker.sock`;
  // process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE = `${process.env.HOME}.colima/default/docker.sock`;
  // process.env.TESTCONTAINERS_HOST_OVERRIDE = execSync(
  //   "colima ls -j | jq -r '.address'",
  //   { encoding: 'utf-8' },
  // ).trim();

  const kafkaContainer = await new KafkaContainer(
    'confluentinc/cp-kafka:7.2.15',
  )
    .withExposedPorts(9092)
    .start();
  process.env.KAFKA_BROKER_URLS = `${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`;

  const postgresContainer = await new GenericContainer('postgres:13')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'prisma',
      POSTGRES_PASSWORD: 'prisma',
      POSTGRES_DB: 'recipes-db',
    })
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
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
  global.kafkaContainer = kafkaContainer;
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
        isPublic: recipe.isPublic,
        steps: {
          create: recipe.steps.map((step, i) => ({
            displayOrder: i,
            instruction: step.instruction,
            ingredients: {
              createMany: {
                data: step.ingredients.map((ingredient, k) => ({
                  displayOrder: k,
                  name: ingredient.name,
                  amount: ingredient.amount,
                  unit: ingredient.unit as MeasurementUnit,
                })),
              },
            },
          })),
        },
        userId: user.id,
      },
    });
  }
}
