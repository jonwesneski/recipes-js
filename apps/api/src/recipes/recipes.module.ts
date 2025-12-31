import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AwsModule,
  ImageReviewProcessorModule,
  KafkaProducerModule,
  RecipeRepositoryModule,
  RekognitionService,
  S3Service,
  UserRepositoryModule,
} from '@repo/nest-shared';
import { KafkaProducerService } from '@src/common';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { NotificationsService } from '@src/notifications/notifications.service';
import { UsersService } from '@src/users';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AwsModule,
    ImageReviewProcessorModule,
    KafkaProducerModule,
    NotificationsModule,
    RecipeRepositoryModule,
    UserRepositoryModule,
  ],
  controllers: [RecipesController],
  providers: [
    NotificationsService,
    RecipesService,
    RekognitionService,
    S3Service,
    UsersService,
    {
      provide: KafkaProducerService,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('SWAGGER_ONLY')) {
          return null;
        }

        return await KafkaProducerService.createInstance(
          configService.getOrThrow('kafkaProducerConfig'),
        );
      },
    },
  ],
})
export class RecipesModule {}
