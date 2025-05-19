import { Module } from '@nestjs/common';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RecipesModule,
  ],
})
export class AppModule {}
