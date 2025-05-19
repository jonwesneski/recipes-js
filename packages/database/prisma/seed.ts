import { PrismaClient } from '../generated/prisma/client';
import data from './seedData.json';

const prisma = new PrismaClient();

async function main() {
    // Create a new user
    const user = await prisma.user.create({
        data: {
            name: 'jon',
            email: 'j@j.com',
        },
    });

    for (const recipeData of data.recipes) {
        const recipe = await prisma.recipe.create({
            data: {
                name: recipeData.name,
                description: recipeData.description,
                slug: recipeData.slug,
                steps: {
                    create: recipeData.steps.map((step) => ({
                        instruction: step.instruction,
                        ingredients: {
                            createMany: {
                                data: step.ingredients.map((ingredient) => ({
                                    name: ingredient.name,
                                    amount: ingredient.amount,
                                    unit: ingredient.unit,
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
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
