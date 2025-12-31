import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PrismaService,
  RecipeInclude,
  RecipePrismaType,
} from '@repo/nest-shared';
import { configureApp } from '@src/common';
import {
  CreateRecipeDto,
  PatchRecipeDto,
  PatchStepDto,
  RecipeResponse,
  StepResponse,
} from '@src/recipes/contracts';
import { GetRecipesDto } from '@src/recipes/contracts/get-recipes.dto';
import request from 'supertest';
import { App } from 'supertest/types';
import { v4 as uuidv4 } from 'uuid';
import { createTestingFixtures } from './utils';

const basePath = '/v1/recipes';

describe('RecipesController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  const { createTestingModule } = createTestingFixtures();
  let user1: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let user2: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let recipe1: RecipePrismaType;
  let token: string;
  let token2: string;

  beforeEach(async () => {
    const moduleFixture = await createTestingModule();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    user1 = await prismaService.user.findUniqueOrThrow({
      where: { handle: 'jon' },
    });
    user2 = await prismaService.user.findUniqueOrThrow({
      where: { handle: 'jon2' },
    });
    recipe1 = await prismaService.recipe.findUniqueOrThrow({
      where: {
        userId_name: {
          userId: user1.id,
          name: 'Tres Leches Cake',
        },
      },
      ...RecipeInclude,
    });

    const payload = {
      sub: user1.id,
      email: user1.email,
      handle: user1.handle,
    };
    const secret = process.env.JWT_SECRET;
    token = new JwtService().sign(payload, { secret });
    token2 = new JwtService().sign(
      {
        sub: user2.id,
        email: user2.email,
        handle: user2.handle,
      },
      { secret },
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

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
          ingredients: [
            {
              name: 'Ingredient 1',
              amount: 100,
              isFraction: false,
              unit: 'grams',
            },
          ],
          base64Image: null,
        },
      ],
      equipments: [],
      tags: [],
      servingAmount: null,
      servingUnit: null,
      servings: null,
      nutritionalFacts: null,
      preparationTimeInMinutes: 30,
      cookingTimeInMinutes: 15,
      cuisine: null,
      dish: null,
      meal: null,
      diets: [],
      proteins: [],
      difficultyLevel: null,
      ...overrides,
    };
  };

  describe(`POST ${basePath}/search`, () => {
    const searchPath = `${basePath}/search`;
    const makeSearchRequest = (
      filters?: GetRecipesDto['filters'],
    ): GetRecipesDto => {
      return { filters };
    };

    it('no filters', async () => {
      await request(app.getHttpServer())
        .post(searchPath)
        .send(makeSearchRequest())
        .expect(200)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });
  });

  describe(`GET ${basePath}/:id`, () => {
    it('existing recipe', async () => {
      await request(app.getHttpServer())
        .get(`${basePath}/${recipe1!.id}`)
        .expect(200)
        .expect((res) => {
          const emptyRecipe = new RecipeResponse();
          const skippedFields = {
            bookmarked: true,
            isPublic: true,
          };
          for (const field in emptyRecipe) {
            if (skippedFields[field]) {
              continue;
            }
            expect(res.body[field]).toBeDefined();
          }
        });
    });

    it('non-existing recipe', async () => {
      await request(app.getHttpServer())
        .get(`${basePath}/123`)
        .expect(404)
        .expect({ message: 'Not Found', statusCode: 404 });
    });

    it('amIFollowing is present', async () => {
      const response = await request(app.getHttpServer())
        .get(`${basePath}/${recipe1!.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body.user.amIFollowing).toBeDefined();
    });

    it('amIFollowing is not present if same user', async () => {
      const response = await request(app.getHttpServer())
        .get(`${basePath}/${recipe1!.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user.amIFollowing).toBeUndefined();
    });

    it('amIFollowing is not present if guest', async () => {
      const response = await request(app.getHttpServer()).get(
        `${basePath}/${recipe1!.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.user.amIFollowing).toBeUndefined();
    });

    it('amIFollowing is true', async () => {
      await request(app.getHttpServer())
        .put(`/v1/users/${user1.id}/follow`)
        .send({ follow: true })
        .set('Authorization', `Bearer ${token2}`);

      const response = await request(app.getHttpServer())
        .get(`${basePath}/${recipe1!.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body.user.amIFollowing).toBeTruthy();
    });
  });

  describe(`POST ${basePath}`, () => {
    it('create new recipe', async () => {
      const sampleRecipe = makeCreateDto();
      const response = await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe);

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(sampleRecipe.name);
      expect(response.body.id).toBeDefined();
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
          steps: [
            {
              ingredients: [
                { unit: true, isFraction: 'YES', amount: 'left', name: 0 },
              ],
            },
          ],
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            name: 'should not be empty',
            description:
              'description must be a string, description should not be empty',
            preparationTimeInMinutes:
              'preparationTimeInMinutes must not be less than 0, preparationTimeInMinutes must be an integer number',
            cookingTimeInMinutes:
              'cookingTimeInMinutes must not be less than 0, cookingTimeInMinutes must be an integer number',
            base64Image:
              'base64Image should not be empty, base64Image must be a string',
            steps: {
              '0': {
                ingredients: {
                  '0': {
                    amount:
                      'amount must not be less than 0, amount must be a number conforming to the specified constraints',
                    isFraction: 'isFraction must be a boolean value',
                    name: 'name must be a string',
                    unit: 'unit must be one of the following values: cups, fluidOunces, tablespoons, teaspoons, pints, quarts, gallons, pounds, ounces, liters, milliliters, kilograms, grams',
                  },
                },
                instruction: 'instruction must be a string',
                base64Image: 'base64Image must be a string',
              },
            },
            servingAmount:
              'servingAmount must not be less than 0, servingAmount must be a number conforming to the specified constraints',
            servingUnit:
              'servingUnit must be one of the following values: cups, fluidOunces, tablespoons, teaspoons, pints, quarts, gallons, pounds, ounces, liters, milliliters, kilograms, grams',
            servings:
              'servings must not be less than 0, servings must be a number conforming to the specified constraints',
            tags: 'each value in tags must be a string, tags must be an array',
            equipments:
              'each value in equipments must be a string, equipments must be an array',
            cuisine:
              'cuisine must be one of the following values: thai, indian, chinese, japanese, korean, vietnamese, filipino, indonesian, malaysian, singaporean, taiwanese, burmese, mongolian, spanish, french, italian, british, german, irish, polish, russian, portuguese, turkish, scandinavian, dutch, belgian, austrian, swiss, hungarian, czech, middleEastern, greek, lebanese, moroccan, egyptian, tunisian, israeli, mexican, american, caribbean, brazilian, peruvian, argentinian, colombian, cuban, jamaican, ethiopian, nigerian, southAfrican, kenyan, ghanaian, fusion, contemporary, cajunCreole, texMex, mediterranean, latinAmerican, southeastAsian, eastAsian, northAfrican, westAfrican, centralAmerican, southAmerican, pacificIslander',
            diets:
              'each value in diets must be one of the following values: vegetarian, vegan, glutenFree, dairyFree, nutFree, lowCarb, diets must be an array',
            difficultyLevel:
              'difficultyLevel must be one of the following values: easy, medium, hard',
            dish: 'dish must be one of the following values: soup, stew, chili, broth, bisque, salad, slaw, casserole, stirFry, roast, grill, pasta, pizza, sandwich, burger, tacos, curry, rice, noodles, side, appetizer, dimSum, mezes, bread, pastry, pie, cake, cookies, beverage, smoothie, cocktail, sauce, condiment, dip, chutney, salsa',
            meal: 'meal must be one of the following values: breakfast, lunch, dinner, snack, dessert',
            proteins:
              'each value in proteins must be one of the following values: chicken, turkey, duck, quail, beef, pork, lamb, veal, venison, bison, goat, salmon, tuna, cod, halibut, tilapia, trout, mahi, swordfish, seaBass, snapper, shrimp, crab, lobster, scallops, clams, mussels, oysters, squid, octopus, tofu, tempeh, seitan, legumes, nuts, seeds, eggs, cheese, yogurt, bacon, sausage, deli, plantBasedMeat, proteins must be an array',
            isPublic: 'isPublic must be a boolean value',
          });
        });
    });
  });

  describe(`PATCH ${basePath}/:id`, () => {
    const createRecipe = async (): Promise<RecipeResponse> => {
      const sampleRecipe = makeCreateDto({ name: uuidv4() });

      const response = await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(201);
      return response.body as RecipeResponse;
    };

    const stepEntityToDto = (
      entity: StepResponse[],
      newSteps?: PatchStepDto[],
    ): PatchStepDto[] => {
      const updated: PatchStepDto[] = entity.map((s) => {
        return {
          instruction: s.instruction || undefined,
          ingredients: s.ingredients.map((i) => {
            return {
              id: i.id,
              name: i.name,
              amount: i.amount,
              isFraction: false,
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

      const editRecipe: PatchRecipeDto = {
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
      const editRecipe: PatchRecipeDto = {
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
      const editRecipe: PatchRecipeDto = {
        steps: stepEntityToDto(steps, [
          {
            ingredients: [
              {
                name: 'New Ingredient',
                amount: 50,
                isFraction: false,
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
      const editRecipe: PatchRecipeDto = {
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
      // TODO: Thinking about making empty steps not allowed; maybe throw a 400
      // should i handle at prisma level or at controller level?
      const response = await createRecipe();

      const editRecipe: PatchRecipeDto = {
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

  describe(`PUT ${basePath}/:id/bookmark`, () => {
    const bookmarkPath = () => `${basePath}/${recipe1.id}/bookmark`;

    it('bookmark valid', async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: true })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it('bookmark already exists is valid', async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: true })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it('bad request', async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: 1 })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(400);
      expect(response.body.bookmark).toBe('bookmark must be a boolean value');
    });

    it('unbookmark valid', async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: false })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it('unbookmark again valid', async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: false })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it("can't bookmark if user owns recipe", async () => {
      const response = await request(app.getHttpServer())
        .put(bookmarkPath())
        .send({ bookmark: true })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: "Can't bookmark user's own recipe",
        statusCode: 400,
      });
    });
  });
});
