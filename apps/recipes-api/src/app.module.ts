import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from './healthCheck';
import { RecipesModule } from './recipes';
import { TagsModule } from './tags';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthCheckModule,
    RecipesModule,
    TagsModule,
  ],
})
export class AppModule {}
