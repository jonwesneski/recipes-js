import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('AppController', () => {
  let controllerUnderTest: RecipesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [RecipesService],
    }).compile();

    controllerUnderTest = app.get<AppController>(RecipesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controllerUnderTest.getHello()).toBe('Hello World!');
    });
  });
});
