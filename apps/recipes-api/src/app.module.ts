import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthCheckModule } from './healthCheck';
import { RecipesModule } from './recipes';
import { TagsModule } from './tags';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HealthCheckModule,
    RecipesModule,
    TagsModule,
  ],
})
export class AppModule {}
