import { MeasurementUnit, PrismaClient } from '../generated/prisma/client';
import { PrismaClientKnownRequestError } from '../src/client';
import data from './seedData.json';

const prisma = new PrismaClient();

async function main() {
  // Create a new user
  let user = await prisma.user.findUnique({
    where: {
      email: 'j@j.com',
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'jon',
        handle: 'jon',
        email: 'j@j.com',
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
              steps: {
                create: recipeData.steps.map((step) => ({
                  instruction: step.instruction,
                  ingredients: {
                    createMany: {
                      data: step.ingredients.map((ingredient) => ({
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
              userHandle: user.handle,
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
