// rekognition.service.ts
import {
  DetectLabelsCommand,
  DetectModerationLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RekognitionService {
  private client = new RekognitionClient({ region: 'us-east-1' }); // set your region

  async detectLabels(imageBytes: Buffer) {
    try {
      const command = new DetectLabelsCommand({
        Image: { Bytes: imageBytes },
        MaxLabels: 10,
        MinConfidence: 75,
      });

      const response = await this.client.send(command);
      return response.Labels;
    } catch (error) {
      throw new InternalServerErrorException(
        'AWS Rekognition failed to detect labels',
      );
    }
  }

  async detectModerationLabels(imageBytes: Buffer) {
    try {
      const command = new DetectModerationLabelsCommand({
        Image: { Bytes: imageBytes },
        MinConfidence: 70,
      });

      const response = await this.client.send(command);
      return response.ModerationLabels;
    } catch (error) {
      throw new InternalServerErrorException(
        'AWS Rekognition failed to detect moderation labels',
      );
    }
  }
}
