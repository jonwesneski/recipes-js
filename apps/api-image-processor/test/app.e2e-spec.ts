import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ImageReviewProcessorService,
  NEW_RECIPE_IMAGE_TOPIC,
  PrismaService,
} from '@repo/nest-shared';
import { Kafka, logLevel, Producer } from 'kafkajs';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// TODO still working on making this test pass
// I'm not sure how to handle the consumer yet
describe.skip('App', () => {
  let app: INestApplication<App>;
  let producer: Producer;
  let prismaService: PrismaService;
  let mockImageReviewProcessorService: jest.Mocked<ImageReviewProcessorService>;

  beforeEach(async () => {
    mockImageReviewProcessorService = {
      processRecipeImage: jest.fn(),
      processRecipeStepImage: jest.fn(),
    } as unknown as jest.Mocked<ImageReviewProcessorService>;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ImageReviewProcessorService)
      .useValue(mockImageReviewProcessorService)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    const kafka = new Kafka({
      logLevel: logLevel.NOTHING,
      brokers: process.env.KAFKA_BROKER_URLS!.split(','),
    });

    producer = kafka.producer();
    await producer.connect();
  });

  afterEach(async () => {
    await producer.disconnect();
    await app.close();
  });

  it('Consume new recipe image topic', async () => {
    await producer.send({
      topic: NEW_RECIPE_IMAGE_TOPIC,
      messages: [
        {
          key: '1',
          value: JSON.stringify({
            recipeId: '1',
            base64Image: '1',
          }),
        },
      ],
    });

    expect(
      mockImageReviewProcessorService.processRecipeImage,
    ).toHaveBeenCalledWith({
      recipeId: '1',
      base64Image: '1',
    });
  });
});
