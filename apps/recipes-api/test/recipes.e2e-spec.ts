import { CanActivate, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'src/auth/guards';
import { configureApp, PrismaService } from 'src/common';
import { CreateRecipeDto, RecipeEntity } from 'src/recipes/contracts';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const basePath = '/v1/recipes';

describe('RecipesController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  const mockJwtGuard: CanActivate = { canActivate: jest.fn(() => true) };
  let user1: Awaited<ReturnType<PrismaService['user']['findUnique']>>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    user1 = await prismaService.user.findUnique({
      where: { handle: 'jon' },
    });

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

  describe(`GET ${basePath}/[user]/[slug]`, () => {
    it('existing recipe', () => {
      return request(app.getHttpServer())
        .get(`${basePath}/${user1!.handle}/tres-leches-cake`)
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
        .get(`${basePath}/${user1!.handle}/test-recipe`)
        .expect(404)
        .expect({ message: 'Not Found', statusCode: 404 });
    });
  });

  describe(`POST ${basePath}`, () => {
    it('create new recipe', () => {
      return request(app.getHttpServer())
        .post(basePath)
        .send({
          name: 'Test Recipe',
          description: 'This is a test recipe',
          slug: 'test-recipe',
          steps: [
            {
              instruction: 'Step 1',
              ingredients: [
                { name: 'Ingredient 1', amount: 100, unit: 'grams' },
              ],
            },
          ],
          tags: [],
          nutritionalFacts: null,
          preparationTimeInMinutes: 30,
          cookingTimeInMinutes: 15,
          userHandle: user1!.handle,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.name).toBe('Test Recipe');
          expect(res.body.slug).toBe('test-recipe');
        });
    });

    it('create existing recipe', async () => {
      const sampleRecipe: CreateRecipeDto = {
        name: 'sample Recipe',
        description: 'This is a test recipe',
        slug: 'sample-recipe',
        steps: [
          {
            instruction: 'Step 1',
            ingredients: [{ name: 'Ingredient 1', amount: 100, unit: 'grams' }],
          },
        ],
        tags: [],
        nutritionalFacts: null,
        preparationTimeInMinutes: 30,
        cookingTimeInMinutes: 15,
        userHandle: user1!.handle,
      };

      await request(app.getHttpServer()).post(basePath).send(sampleRecipe);

      return request(app.getHttpServer())
        .post(basePath)
        .send(sampleRecipe)
        .expect(409)
        .expect({
          message: 'Recipe with slug "sample-recipe" already exists.',
          error: 'Conflict',
          statusCode: 409,
        });
    });

    it.skip('create recipe with missing fields', () => {
      return request(app.getHttpServer())
        .post(basePath)
        .send({
          name: 'Incomplete Recipe',
          steps: [],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('description should not be empty');
          expect(res.body.message).toContain('slug should not be empty');
        });
    });
  });
});
