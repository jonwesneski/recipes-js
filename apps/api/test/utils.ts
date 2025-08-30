import { Test } from '@nestjs/testing';
import { RekognitionService, S3Service } from '@repo/nest-shared';
import { AiService } from '@src/ai/ai.service';
import { AppModule } from '@src/app.module';
import { JwtGuard } from '@src/auth/guards';
import { KafkaProducerService } from '@src/common';

export const createTestingFixtures = () => {
  const mockJwtGuard = { canActivate: jest.fn(() => true) };
  const mockS3Service = {
    uploadFile: jest.fn().mockResolvedValue(undefined),
    makeS3ImageUrl: jest
      .fn()
      .mockReturnValue({ s3BucketKeyName: 'string', s3ImageUrl: 'string' }),
  };
  const mockKafkaProducerService = {
    createInstance: jest.fn(),
    sendMessage: jest.fn().mockResolvedValue(undefined),
  };
  const mockRekognitionService = {
    isValidFoodImage: jest.fn().mockResolvedValue(true),
  };
  const mockAiService: jest.Mocked<AiService> = {
    nutritionalFacts: jest.fn().mockResolvedValue({}),
  } as unknown as jest.Mocked<AiService>;

  const createTestingModule = async () => {
    return await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .overrideProvider(S3Service)
      .useValue(mockS3Service)
      .overrideProvider(KafkaProducerService)
      .useValue(mockKafkaProducerService)
      .overrideProvider(RekognitionService)
      .useValue(mockRekognitionService)
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .compile();
  };

  return {
    createTestingModule,
    mockJwtGuard,
    mockS3Service,
    mockKafkaProducerService,
    mockRekognitionService,
  };
};
