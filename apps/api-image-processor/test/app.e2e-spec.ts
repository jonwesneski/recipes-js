import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ImageReviewProcessorService,
  NEW_RECIPE_IMAGE_TOPIC,
  PrismaService,
  RecipeInclude,
  RecipePrismaType,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { KafkaConsumerService } from '@src/kafka-consumer.service';
import { Kafka, logLevel, Producer } from 'kafkajs';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const waitFor = async (
  callback: (resolve: (value: void | PromiseLike<void>) => void) => void,
  timeout: number = 4000,
): Promise<void> => {
  await Promise.race([
    new Promise((_resolve, _) => {
      callback(_resolve);
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject('Timeout waiting to resolve'), timeout),
    ),
  ]);
};

// TODO still working on making this test pass
// I'm not sure how to handle the consumer yet
describe('App', () => {
  let app: INestApplication<App>;
  let producer: Producer;
  let prismaService: PrismaService;
  let imageReviewProcessorService: ImageReviewProcessorService;
  let mockRekognitionService: jest.Mocked<RekognitionService>;
  let mockS3Service: jest.Mocked<S3Service>;

  let user1: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let recipe1: RecipePrismaType;

  beforeEach(async () => {
    mockRekognitionService = {
      isValidFoodImage: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<RekognitionService>;
    mockS3Service = {
      uploadFile: jest.fn().mockResolvedValue(undefined),
      makeS3ImageUrl: jest
        .fn()
        .mockResolvedValue({ s3BucketKeyName: 'fake', s3ImageUrl: 'fakse' }),
    } as unknown as jest.Mocked<S3Service>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RekognitionService)
      .useValue(mockRekognitionService)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .compile();

    app = moduleFixture.createNestApplication();
    imageReviewProcessorService =
      moduleFixture.get<ImageReviewProcessorService>(
        ImageReviewProcessorService,
      );
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    user1 = await prismaService.user.findUniqueOrThrow({
      where: { handle: 'jon' },
    });
    recipe1 = await prismaService.recipe.findUniqueOrThrow({
      where: {
        userId_name: {
          userId: user1.id,
          name: 'Tres Leches Cake',
        },
      },
      include: RecipeInclude,
    });

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
    await app.get(KafkaConsumerService)['_consumer'].disconnect();
    await app.close();
  });

  it('Consume new recipe image topic', async () => {
    const waitForMessage = waitFor((resolve) => {
      jest
        .spyOn(imageReviewProcessorService, 'processRecipeImage')
        .mockImplementationOnce(async (key, data) => {
          expect(key).toBe(user1.id);
          expect(data).toEqual({
            recipeId: recipe1.id,
            base64Image: '1',
          });
          resolve();
          // Now I am calling the real method
          return await imageReviewProcessorService.processRecipeImage.apply(
            imageReviewProcessorService,
            [key, data],
          );
        });
    });

    await producer.send({
      topic: NEW_RECIPE_IMAGE_TOPIC,
      messages: [
        {
          key: user1.id,
          value: JSON.stringify({
            recipeId: recipe1.id,
            base64Image: '1',
          }),
        },
      ],
    });

    await waitForMessage;
    expect(
      jest.spyOn(imageReviewProcessorService, 'processRecipeStepImage'),
    ).not.toHaveBeenCalled();
    expect(
      jest.spyOn(mockRekognitionService, 'isValidFoodImage'),
    ).toHaveBeenCalled();
    expect(jest.spyOn(mockS3Service, 'makeS3ImageUrl')).toHaveBeenCalled();
    expect(jest.spyOn(mockS3Service, 'uploadFile')).toHaveBeenCalled();
    expect(jest.spyOn(prismaService.recipe, 'update')).toHaveBeenCalled();
    const updatedRecipe = await prismaService.recipe.findFirstOrThrow({
      where: { id: recipe1.id },
    });
    expect(updatedRecipe.imageUrl).toBe('fake');
  });
});
