// TODO: In the future, this file will just exist in api-image-processor, not in the shared package
import { Injectable, Logger } from '@nestjs/common';
import { RecipeRepository } from '../repositories/recipe';
import { RekognitionService } from './rekognition.service';
import { S3Service } from './s3.service';
// import { SqsMessageHandler } from '@ssut/nestjs-sqs';
// import { SQS } from 'aws-sdk';

@Injectable()
export class ImageReviewProcessorService {
  private readonly logger = new Logger(ImageReviewProcessorService.name);

  constructor(
    private readonly recognitionService: RekognitionService,
    private readonly recipeReposity: RecipeRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async processImage(base64Image: string) {
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const labels = await this.recognitionService.detectLabels(imageBuffer);
    labels?.forEach((label) => {
      this.logger.log(
        `Detected label: ${label.Name} with confidence ${label.Confidence}`,
      );
    });
    //await this.s3Service.uploadFile('key', imageBuffer);
  }

  //   // Specify the queue URL or queue name here as registered in Module
  //   @SqsMessageHandler('your-queue-name')
  //   async handleMessage(message: SQS.Message) {
  //     this.logger.log(`Received message with Body: ${message.Body}`);

  //     // Process your message here (e.g., JSON.parse, business logic)
  //     // Acknowledge is automatic unless the function throws an error

  //     // Example:
  //     const payload = JSON.parse(message.Body ?? '{}');

  //     // ... your processing logic ...

  //     this.logger.log(`Processed message id: ${message.MessageId}`);
  //   }
}
