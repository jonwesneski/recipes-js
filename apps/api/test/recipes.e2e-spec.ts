import { CanActivate, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/auth/guards';
import { configureApp, PrismaService } from 'src/common';
import { S3Service } from 'src/common/s3.service';
import { RecipeInclude, RecipePrismaType } from 'src/recipes';
import {
  CreateRecipeDto,
  EditRecipeDto,
  EditStepDto,
  RecipeEntity,
  StepEntity,
} from 'src/recipes/contracts';
import request from 'supertest';
import { App } from 'supertest/types';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../src/app.module';

const basePath = '/v1/recipes';

describe('RecipesController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  const mockJwtGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockS3Service = {
    uploadFile: jest.fn(),
    makeS3ImageUrl: jest
      .fn()
      .mockReturnValue({ s3BucketKeyName: 'string', s3ImageUrl: 'string' }),
  };
  let user1: Awaited<ReturnType<PrismaService['user']['findUnique']>>;
  let recipe1: RecipePrismaType;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    mockS3Service.uploadFile.mockResolvedValue('url');
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

    const payload = {
      sub: user1.id,
      email: user1.email,
      handle: user1.handle,
    };
    const secret = process.env.JWT_SECRET;
    token = new JwtService().sign(payload, { secret });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`GET ${basePath}`, () => {
    it('no query params', () => {
      return request(app.getHttpServer())
        .get(basePath)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe(`GET ${basePath}/[userId]/[id]`, () => {
    it('existing recipe', () => {
      return request(app.getHttpServer())
        .get(`${basePath}/${user1!.id}/${recipe1!.id}`)
        .expect(200)
        .expect((res) => {
          const emptyRecipe = new RecipeEntity();
          for (const field in emptyRecipe) {
            expect(res.body[field]).toBeDefined();
          }
        });
    });

    it('non-existing recipe', () => {
      return request(app.getHttpServer())
        .get(`${basePath}/${user1!.id}/123`)
        .expect(404)
        .expect({ message: 'Not Found', statusCode: 404 });
    });
  });

  describe(`POST ${basePath}`, () => {
    const makeCreateDto = (
      overrides?: Partial<CreateRecipeDto>,
    ): CreateRecipeDto => {
      return {
        name: 'Test Recipe',
        description: 'This is a test recipe',
        base64Image: '123',
        isPublic: true,
        steps: [
          {
            instruction: 'Step 1',
            ingredients: [{ name: 'Ingredient 1', amount: 100, unit: 'grams' }],
          },
        ],
        equipments: [],
        tags: [],
        nutritionalFacts: null,
        preparationTimeInMinutes: 30,
        cookingTimeInMinutes: 15,
        ...overrides,
      };
    };

    it('create new recipe', () => {
      const sampleRecipe = makeCreateDto();
      return request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test Recipe');
          expect(res.body.id).toBeDefined();
        });
    });

    it('create existing recipe', async () => {
      const sampleRecipe = makeCreateDto({ name: 'sample Recipe' });

      await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe);

      return request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(409)
        .expect({
          message: 'Recipe with name "sample Recipe" already exists.',
          error: 'Conflict',
          statusCode: 409,
        });
    });

    it('create recipe with missing fields', () => {
      return request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          steps: [{ unit: true, amount: 'left', name: 0 }],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            name: 'should not be empty',
            tags: 'each value in tags must be a string, tags must be an array',
            equipments:
              'each value in equipments must be a string, equipments must be an array',
            isPublic: 'isPublic must be a boolean value',
            steps: {
              '0': {
                amount: 'property amount should not exist',
                ingredients:
                  'ingredients should not be empty, ingredients must be an array',
                name: 'property name should not exist',
                unit: 'property unit should not exist',
              },
            },
          });
        });
    });
  });

  describe(`PATCH ${basePath}/[id]`, () => {
    const createRecipe = async (): Promise<RecipeEntity> => {
      const sampleRecipe: CreateRecipeDto = {
        name: uuidv4(),
        description: 'This is a test recipe',
        base64Image: '123',
        isPublic: true,
        steps: [
          {
            instruction: 'Step 1',
            ingredients: [{ name: 'Ingredient 1', amount: 100, unit: 'grams' }],
          },
        ],
        tags: [],
        equipments: [],
        nutritionalFacts: null,
        preparationTimeInMinutes: 30,
        cookingTimeInMinutes: 15,
      };

      const response = await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(201);
      return response.body as RecipeEntity;
    };

    const stepEntityToDto = (
      entity: StepEntity[],
      newSteps?: EditStepDto[],
    ): EditStepDto[] => {
      const updated: EditStepDto[] = entity.map((s) => {
        return {
          instruction: s.instruction || undefined,
          ingredients: s.ingredients.map((i) => {
            return {
              id: i.id,
              name: i.name,
              amount: i.amount,
              unit: i.unit,
            };
          }),
        };
      });
      if (newSteps) {
        updated.push(...newSteps);
      }

      return updated;
    };

    it('update top recipe fields', async () => {
      const response = await createRecipe();

      const editRecipe: EditRecipeDto = {
        name: 'edit',
        description: 'new description',
        base64Image: '1234',
        preparationTimeInMinutes: 15,
        cookingTimeInMinutes: 30,
      };

      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(editRecipe.name);
          expect(res.body.id).toBeDefined();
          expect(res.body.description).toBe(editRecipe.description);
          expect(res.body.imageUrl).toBeDefined();
          expect(res.body.base64Image).not.toBeDefined();
          expect(res.body.preparationTimeInMinutes).toBe(
            editRecipe.preparationTimeInMinutes,
          );
          expect(res.body.cookingTimeInMinutes).toBe(
            editRecipe.cookingTimeInMinutes,
          );
        });
    });

    it('replace an existing step', async () => {
      const response = await createRecipe();

      const steps = [...response.steps];
      const editRecipe: EditRecipeDto = {
        steps: stepEntityToDto(steps),
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps[0].id).not.toBe(response.steps[0].id);
        });
    });

    it('add another ingredient to step', async () => {
      const response = await createRecipe();

      const steps = [...response.steps];
      const editRecipe: EditRecipeDto = {
        steps: stepEntityToDto(steps, [
          {
            ingredients: [
              {
                name: 'New Ingredient',
                amount: 50,
                unit: 'grams',
              },
            ],
          },
        ]),
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps[0].id).not.toBe(response.steps[0].id);
        });
    });

    it('re-create ingredients to existing step', async () => {
      const response = await createRecipe();

      const steps = [...response.steps];
      steps[0].ingredients[0].id = undefined as unknown as string;
      steps[0].ingredients[0].name = 'New Ingredient';
      steps[0].ingredients[0].amount = 50;
      steps[0].ingredients[0].unit = 'grams';
      const editRecipe: EditRecipeDto = {
        steps: stepEntityToDto(steps),
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps[0].id).not.toBe(response.steps[0].id);
        });
    });

    it.skip('replace with empty steps', async () => {
      // TODO: lets make empty steps not allowed; maybe throw a 400
      // should i handle at prisma level or at controller level?
      const response = await createRecipe();

      const editRecipe: EditRecipeDto = {
        steps: [],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(400)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });
});
