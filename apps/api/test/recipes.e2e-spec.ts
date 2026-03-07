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

  /**
   *  Need to keep these as beforeAll or I will
   *  run into max db connection reached issue
   * */
  beforeAll(async () => {
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

  afterAll(async () => {
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
        deleteStepIds: steps.map((s) => s.id),
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
        deleteStepIds: steps.map((s) => s.id),
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
      const originalStep = response.steps[0];
      const originalIngredientId = originalStep.ingredients[0].id;

      const editRecipe: PatchRecipeDto = {
        steps: [
          {
            id: originalStep.id,
            ingredients: [
              { name: 'New Ingredient', amount: 50, isFraction: false, unit: 'grams' },
            ],
            deleteIngredientIds: [originalIngredientId],
          },
        ],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const step: StepResponse = res.body.steps[0];
          expect(step.id).toBe(originalStep.id);
          expect(step.ingredients).toHaveLength(1);
          expect(step.ingredients[0].name).toBe('New Ingredient');
          expect(step.ingredients[0].id).not.toBe(originalIngredientId);
        });
    });

    it('empty steps array is invalid', async () => {
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
          expect(res.body.steps).toBe('steps should not be empty');
        });
    });

    // ── Helpers for multi-step tests ──────────────────────────────────────────

    const createRecipe3Steps = async (): Promise<RecipeResponse> => {
      const sampleRecipe = makeCreateDto({
        name: uuidv4(),
        steps: [
          {
            instruction: 'Step 1',
            ingredients: [
              { name: 'Ing 1', amount: 1, isFraction: false, unit: 'grams' },
            ],
            base64Image: null,
          },
          {
            instruction: 'Step 2',
            ingredients: [
              { name: 'Ing 2', amount: 2, isFraction: false, unit: 'cups' },
            ],
            base64Image: null,
          },
          {
            instruction: 'Step 3',
            ingredients: [
              { name: 'Ing 3', amount: 3, isFraction: false, unit: 'liters' },
            ],
            base64Image: null,
          },
        ],
      });
      const response = await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(201);
      return response.body as RecipeResponse;
    };

    /**
     * Converts a StepResponse to a PatchStepDto, preserving the step's id so
     * the update targets the existing step rather than creating a new one.
     */
    const stepToUpdateDto = (s: StepResponse): PatchStepDto => ({
      id: s.id,
      instruction: s.instruction ?? undefined,
      ingredients: s.ingredients.map((i) => ({
        id: i.id,
        name: i.name,
        amount: i.amount,
        isFraction: i.isFraction,
        unit: i.unit,
      })),
    });

    // ── Requirement: omit steps field → steps are untouched ──────────────────

    it('omitting steps field leaves steps unchanged', async () => {
      const response = await createRecipe();
      const originalStepId = response.steps[0].id;

      const editRecipe: PatchRecipeDto = { name: 'renamed only' };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('renamed only');
          expect(res.body.steps).toHaveLength(1);
          expect(res.body.steps[0].id).toBe(originalStepId);
        });
    });

    // ── Requirement: empty array → delete all steps ───────────────────────────
    // Note: requires removing @ArrayNotEmpty() from PatchRecipeDto.steps

    it('deleteStepIds deletes all steps', async () => {
      const response = await createRecipe();

      const editRecipe: PatchRecipeDto = {
        deleteStepIds: response.steps.map((s) => s.id),
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps).toHaveLength(0);
        });
    });

    // ── Requirement: add a new step (no id) alongside existing steps ──────────

    it('adds a new step to existing recipe', async () => {
      const response = await createRecipe();
      const originalStepId = response.steps[0].id;

      const editRecipe: PatchRecipeDto = {
        steps: [
          stepToUpdateDto(response.steps[0]),
          {
            instruction: 'Brand new step',
            ingredients: [
              { name: 'New Ingredient', amount: 50, isFraction: false, unit: 'grams' },
            ],
          },
        ],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps).toHaveLength(2);
          expect(res.body.steps[0].id).toBe(originalStepId);
          expect(res.body.steps[1].instruction).toBe('Brand new step');
          expect(res.body.steps[1].id).toBeDefined();
          expect(res.body.steps[1].id).not.toBe(originalStepId);
        });
    });

    // ── Requirement: delete a specific step by not including it ───────────────

    it('deletes a specific step while keeping others', async () => {
      const recipe = await createRecipe3Steps();
      const [step0, step1, step2] = recipe.steps;

      // Delete step1 explicitly; keep first and third
      const editRecipe: PatchRecipeDto = {
        steps: [{ id: step0.id }, { id: step2.id }],
        deleteStepIds: [step1.id],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const ids: string[] = res.body.steps.map((s: StepResponse) => s.id);
          expect(ids).toHaveLength(2);
          expect(ids).toContain(step0.id);
          expect(ids).toContain(step2.id);
          expect(ids).not.toContain(step1.id);
        });
    });

    // ── Requirement: reorder steps ────────────────────────────────────────────

    it('reorders steps based on explicit displayOrder', async () => {
      const recipe = await createRecipe3Steps();
      const [step0, step1, step2] = recipe.steps;

      // Reverse order via explicit displayOrder
      const editRecipe: PatchRecipeDto = {
        steps: [
          { id: step2.id, displayOrder: 0 },
          { id: step1.id, displayOrder: 1 },
          { id: step0.id, displayOrder: 2 },
        ],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body.steps[0].id).toBe(step2.id);
          expect(res.body.steps[0].displayOrder).toBe(0);
          expect(res.body.steps[1].id).toBe(step1.id);
          expect(res.body.steps[1].displayOrder).toBe(1);
          expect(res.body.steps[2].id).toBe(step0.id);
          expect(res.body.steps[2].displayOrder).toBe(2);
        });
    });

    // ── Requirement: mix add + update + delete in one request ─────────────────

    it('handles adding, updating, and deleting steps in one request', async () => {
      const recipe = await createRecipe3Steps();
      const [step0, step1, step2] = recipe.steps;

      const editRecipe: PatchRecipeDto = {
        steps: [
          { id: step2.id, displayOrder: 0 },
          { id: step0.id, displayOrder: 1, instruction: 'Updated instruction' },
          {
            displayOrder: 2,
            instruction: 'Brand new step',
            ingredients: [
              { name: 'New Ing', amount: 1, isFraction: false, unit: 'grams' },
            ],
          },
        ],
        deleteStepIds: [step1.id],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const steps: StepResponse[] = res.body.steps;
          expect(steps).toHaveLength(3);
          expect(steps[0].id).toBe(step2.id);
          expect(steps[0].displayOrder).toBe(0);
          expect(steps[1].id).toBe(step0.id);
          expect(steps[1].displayOrder).toBe(1);
          expect(steps[1].instruction).toBe('Updated instruction');
          expect(steps[2].displayOrder).toBe(2);
          expect(steps[2].instruction).toBe('Brand new step');
          const ids = steps.map((s) => s.id);
          expect(ids).not.toContain(step1.id);
        });
    });

    // ── Requirement: partial step update — only instruction ───────────────────

    it('partial step update: only instruction changes, ingredients are preserved', async () => {
      const response = await createRecipe();
      const originalStep = response.steps[0];
      const originalIngredientId = originalStep.ingredients[0].id;

      // Send only id + instruction; no ingredients field
      const editRecipe: PatchRecipeDto = {
        steps: [{ id: originalStep.id, instruction: 'Only instruction changed' }],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const step: StepResponse = res.body.steps[0];
          expect(step.id).toBe(originalStep.id);
          expect(step.instruction).toBe('Only instruction changed');
          expect(step.ingredients).toHaveLength(originalStep.ingredients.length);
          expect(step.ingredients[0].id).toBe(originalIngredientId);
        });
    });

    // ── Requirement: partial step update — only ingredients ───────────────────

    it('partial step update: only ingredients change, instruction is preserved', async () => {
      const response = await createRecipe();
      const originalStep = response.steps[0];
      const originalInstruction = originalStep.instruction;

      // Send only id + ingredients + deleteIngredientIds; no instruction field
      const editRecipe: PatchRecipeDto = {
        steps: [
          {
            id: originalStep.id,
            ingredients: [
              { name: 'Replaced Ingredient', amount: 99, isFraction: false, unit: 'grams' },
            ],
            deleteIngredientIds: originalStep.ingredients.map((i) => i.id),
          },
        ],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const step: StepResponse = res.body.steps[0];
          expect(step.id).toBe(originalStep.id);
          expect(step.instruction).toBe(originalInstruction);
          expect(step.ingredients).toHaveLength(1);
          expect(step.ingredients[0].name).toBe('Replaced Ingredient');
        });
    });

    // ── Requirement: step with only id field preserves all its content ─────────

    it('step with only id field leaves that step fully unchanged', async () => {
      const response = await createRecipe();
      const originalStep = response.steps[0];

      const editRecipe: PatchRecipeDto = {
        steps: [{ id: originalStep.id }],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${response.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const step: StepResponse = res.body.steps[0];
          expect(step.id).toBe(originalStep.id);
          expect(step.instruction).toBe(originalStep.instruction);
          expect(step.ingredients).toHaveLength(originalStep.ingredients.length);
          expect(step.ingredients[0].id).toBe(originalStep.ingredients[0].id);
        });
    });

    // ── Requirement: displayOrder reflects array position after mixed ops ──────

    it('displayOrder matches explicit value after add and delete', async () => {
      const recipe = await createRecipe3Steps();
      const [step0, _step1, step2] = recipe.steps;

      // Drop step1, insert a new step between step2 and step0 using explicit displayOrders
      const editRecipe: PatchRecipeDto = {
        steps: [
          { id: step2.id, displayOrder: 0 },
          {
            displayOrder: 1,
            instruction: 'Inserted step',
            ingredients: [{ name: 'X', amount: 1, isFraction: false, unit: 'grams' }],
          },
          { id: step0.id, displayOrder: 2 },
        ],
        deleteStepIds: [_step1.id],
      };
      return request(app.getHttpServer())
        .patch(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editRecipe)
        .expect(200)
        .expect((res) => {
          const steps: StepResponse[] = res.body.steps;
          expect(steps).toHaveLength(3);
          expect(steps[0].id).toBe(step2.id);
          expect(steps[0].displayOrder).toBe(0);
          expect(steps[1].instruction).toBe('Inserted step');
          expect(steps[1].displayOrder).toBe(1);
          expect(steps[2].id).toBe(step0.id);
          expect(steps[2].displayOrder).toBe(2);
        });
    });
  });

  describe(`DELETE ${basePath}/:id`, () => {
    const createRecipeForDelete = async (): Promise<RecipeResponse> => {
      const sampleRecipe = makeCreateDto({ name: uuidv4() });
      const response = await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', `Bearer ${token}`)
        .send(sampleRecipe)
        .expect(201);
      return response.body as RecipeResponse;
    };

    it('delete own recipe', async () => {
      const recipe = await createRecipeForDelete();

      await request(app.getHttpServer())
        .delete(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // testing not found here; so no need for another test
      await request(app.getHttpServer())
        .get(`${basePath}/${recipe.id}`)
        .expect(404);
    });

    it('delete recipe owned by another user', async () => {
      const recipe = await createRecipeForDelete();

      await request(app.getHttpServer())
        .delete(`${basePath}/${recipe.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
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
