import { MeasurementUnit, PrismaClient } from '../generated/prisma/client';
import { PrismaClientKnownRequestError } from '../src/client';
import data from './seedData.json';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findUnique({
    where: {
      email: 'r@h.com',
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'recipe hall',
        handle: 'recipe hall',
        email: 'r@h.com',
        imageUrl:
          'https://ui-avatars.com/api/?name=recipe+hall&uppercase=false&background=random',
      },
    });
  }

  for (const recipeData of data.recipes) {
    const count = recipeData.name === 'BULK' ? 50 : 1;
    for (let i = 0; i < count; i++) {
      let name = recipeData.name;
      if (recipeData.name === 'BULK') {
        name = `Test Recipe ${i + 1}`;
      }

      console.log('====', { name });
      try {
        await prisma.recipe.create({
          data: {
            name,
            description: recipeData.description,
            imageUrl: recipeData.imageUrl,
            isPublic: true,
            steps: {
              create: recipeData.steps.map((step, i) => ({
                displayOrder: i + 1,
                instruction: step.instruction,
                ingredients: {
                  createMany: {
                    data: step.ingredients.map((ingredient, k) => ({
                      displayOrder: k + 1,
                      name: ingredient.name,
                      amount: ingredient.amount,
                      unit: ingredient.unit as MeasurementUnit,
                    })),
                  },
                },
              })),
            },
            recipeTags: {
              create: recipeData.tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag },
                  },
                },
              })),
            },
            nutritionalFacts: {
              create: recipeData.nutritionalFacts,
            },
            userId: user.id,
          },
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code !== 'P2002') {
            throw error; // Re-throw if it's not a unique constraint violation
          }
        }
        throw error;
      }
    }
  }

  for (const predefinedNutrition of data.predefinedDailyNutritions) {
    try {
      await prisma.predefinedDailyNutrition.create({
        data: {
          name: predefinedNutrition.name,
          nutritionalFacts: { create: predefinedNutrition.nutritionalFacts },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code !== 'P2002') {
          throw error; // Re-throw if it's not a unique constraint violation
        }
      }
      throw error;
    }
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
