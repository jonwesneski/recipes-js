import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ImageReviewProcessorService,
  NEW_RECIPE_IMAGE_TOPIC,
  NEW_RECIPE_STEP_IMAGE_TOPIC,
  PrismaService,
  RecipeInclude,
  RecipePrismaType,
  RecipeRepository,
  RekognitionService,
  S3Service,
} from '@repo/nest-shared';
import { KafkaConsumerService } from '@src/kafka-consumer.service';
import { Kafka, logLevel, Producer } from 'kafkajs';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { waitFor } from './utils';

describe('App', () => {
  let app: INestApplication<App>;
  let producer: Producer;
  let recipeRepository: RecipeRepository;
  let prismaService: PrismaService;
  let imageReviewProcessorService: ImageReviewProcessorService;
  let mockRekognitionService: jest.Mocked<RekognitionService>;
  let mockS3Service: jest.Mocked<S3Service>;
  let spyProcessRecipeImage: jest.SpyInstance;
  let spyProcessRecipeStepImage: jest.SpyInstance;

  let user1: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let recipe1: RecipePrismaType;

  beforeAll(async () => {
    mockRekognitionService = {
      detectAllLabels: jest
        .fn()
        .mockResolvedValue({
          labels: [{ Name: 'Food' }],
          moderationLabels: [],
        }),
    } as unknown as jest.Mocked<RekognitionService>;
    mockS3Service = {
      uploadFile: jest.fn().mockResolvedValue(undefined),
      makeS3ImageUrl: jest
        .fn()
        .mockReturnValue({ s3BucketKeyName: 'fake', s3ImageUrl: 'fake' }),
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
    recipeRepository = moduleFixture.get<RecipeRepository>(RecipeRepository);
    spyProcessRecipeImage = jest.spyOn(
      imageReviewProcessorService,
      'processRecipeImage',
    );
    spyProcessRecipeStepImage = jest.spyOn(
      imageReviewProcessorService,
      'processRecipeStepImage',
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

  beforeEach(() => {
    mockS3Service.makeS3ImageUrl.mockClear();
    mockS3Service.uploadFile.mockClear();
    spyProcessRecipeImage.mockClear();
    spyProcessRecipeStepImage.mockClear();
  });

  afterAll(async () => {
    await producer.disconnect();
    await app.get(KafkaConsumerService)['_consumer'].disconnect();
    await app.close();
  });

  describe('new recipe image topic', () => {
    it('Consume valid new recipe image', async () => {
      const waitForMessage = waitFor((resolve) => {
        spyProcessRecipeImage.mockImplementationOnce(async (key, data) => {
          expect(key).toBe(user1.id);
          expect(data).toEqual({
            recipeId: recipe1.id,
            base64Image: '1',
          });
          // Now I am calling the real method
          await imageReviewProcessorService.processRecipeImage.apply(
            imageReviewProcessorService,
            [key, data],
          );
          resolve();
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

      expect(spyProcessRecipeStepImage).not.toHaveBeenCalled();
      expect(mockRekognitionService.detectAllLabels).toHaveBeenCalled();
      expect(mockS3Service.makeS3ImageUrl).toHaveBeenCalled();
      expect(mockS3Service.uploadFile).toHaveBeenCalled();
      const updatedRecipe = await prismaService.recipe.findFirstOrThrow({
        where: { id: recipe1.id },
      });
      expect(updatedRecipe.imageUrl).toBe('fake');
    });

    it("Don't consume invalid recipe image", async () => {
      mockRekognitionService.detectAllLabels.mockResolvedValueOnce({
        labels: [{ Name: 'Cat' }],
        moderationLabels: [],
      });
      const waitForMessage = waitFor((resolve) => {
        spyProcessRecipeImage.mockImplementationOnce(async (key, data) => {
          expect(key).toBe(user1.id);
          expect(data).toEqual({
            recipeId: recipe1.id,
            base64Image: '1',
          });
          // Now I am calling the real method
          await imageReviewProcessorService.processRecipeImage.apply(
            imageReviewProcessorService,
            [key, data],
          );
          resolve();
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

      expect(spyProcessRecipeStepImage).not.toHaveBeenCalled();
      expect(mockRekognitionService.detectAllLabels).toHaveBeenCalled();
      expect(mockS3Service.makeS3ImageUrl).not.toHaveBeenCalled();
      expect(mockS3Service.uploadFile).not.toHaveBeenCalled();
      expect(
        jest.spyOn(recipeRepository, 'addImageToRecipe'),
      ).not.toHaveBeenCalled();
    });
  });

  describe('new recipe step image topic', () => {
    it('Consume valid new recipe step image', async () => {
      const waitForMessage = waitFor((resolve) => {
        spyProcessRecipeStepImage.mockImplementationOnce(async (key, data) => {
          expect(key).toBe(user1.id);
          expect(data).toEqual({
            recipeId: recipe1.id,
            stepId: recipe1.steps[0].id,
            stepIndex: 0,
            base64Image: '1',
          });
          // Now I am calling the real method
          await imageReviewProcessorService.processRecipeStepImage.apply(
            imageReviewProcessorService,
            [key, data],
          );
          resolve();
        });
      });

      await producer.send({
        topic: NEW_RECIPE_STEP_IMAGE_TOPIC,
        messages: [
          {
            key: user1.id,
            value: JSON.stringify({
              recipeId: recipe1.id,
              stepId: recipe1.steps[0].id,
              stepIndex: 0,
              base64Image: '1',
            }),
          },
        ],
      });
      await waitForMessage;

      expect(spyProcessRecipeImage).not.toHaveBeenCalled();
      expect(mockRekognitionService.detectAllLabels).toHaveBeenCalled();
      expect(mockS3Service.makeS3ImageUrl).toHaveBeenCalled();
      expect(mockS3Service.uploadFile).toHaveBeenCalled();
      const updatedRecipe = await prismaService.recipe.findFirstOrThrow({
        where: { id: recipe1.id },
        include: RecipeInclude,
      });
      expect(updatedRecipe.steps[0].imageUrl).toBe('fake');
    });

    it("Don't consume invalid recipe step image", async () => {
      mockRekognitionService.detectAllLabels.mockResolvedValueOnce({
        labels: [{ Name: 'Cat' }],
        moderationLabels: [],
      });
      const waitForMessage = waitFor((resolve) => {
        spyProcessRecipeStepImage.mockImplementationOnce(async (key, data) => {
          expect(key).toBe(user1.id);
          expect(data).toEqual({
            recipeId: recipe1.id,
            stepId: recipe1.steps[0].id,
            stepIndex: 0,
            base64Image: '1',
          });
          // Now I am calling the real method
          await imageReviewProcessorService.processRecipeStepImage.apply(
            imageReviewProcessorService,
            [key, data],
          );
          resolve();
        });
      });

      await producer.send({
        topic: NEW_RECIPE_STEP_IMAGE_TOPIC,
        messages: [
          {
            key: user1.id,
            value: JSON.stringify({
              recipeId: recipe1.id,
              stepId: recipe1.steps[0].id,
              stepIndex: 0,
              base64Image: '1',
            }),
          },
        ],
      });
      await waitForMessage;

      expect(spyProcessRecipeImage).not.toHaveBeenCalled();
      expect(mockRekognitionService.detectAllLabels).toHaveBeenCalled();
      expect(mockS3Service.makeS3ImageUrl).not.toHaveBeenCalled();
      expect(mockS3Service.uploadFile).not.toHaveBeenCalled();
      expect(
        jest.spyOn(recipeRepository, 'addImageToRecipeStep'),
      ).not.toHaveBeenCalled();
    });
  });
});
