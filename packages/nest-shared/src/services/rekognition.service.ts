import {
  DetectLabelsCommand,
  DetectModerationLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { awsConfig, AwsConfigType } from 'src/configs/aws.config';

@Injectable()
export class RekognitionService {
  private readonly logger = new Logger(RekognitionService.name);
  private _client: RekognitionClient;
  constructor(
    @Inject(awsConfig.KEY)
    _awsConfig: AwsConfigType,
  ) {
    this._client = new RekognitionClient({
      region: _awsConfig.region,
      credentials: {
        accessKeyId: _awsConfig.accessKeyId,
        secretAccessKey: _awsConfig.secretAccessKey,
      },
    });
  }

  async isValidFooldImage(imageBytes: Buffer): Promise<boolean> {
    // todo: I may move this method into image-review-processor.service.ts
    const { labels, moderationLabels } = await this.detectAllLabels(imageBytes);
    this.logger.log(
      `Detected labels: ${labels.map((label) => label.Name).join(', ')}`,
    );
    if (moderationLabels?.length) {
      this.logger.warn(
        `Image contains moderation labels: ${moderationLabels.map((label) => label.Name).join(', ')}`,
      );
      return false;
    }

    const nonFoods: string[] = [];
    for (const label of labels) {
      if (label.Name) {
        if (label.Name === 'Food' || label.Name?.includes('Food')) {
          return true;
        }
        nonFoods.push(label.Name);
      }
    }
    this.logger.warn(
      `Image does not contain food or ingredients, found: ${nonFoods.join(', ')}`,
    );

    return false;
  }

  async detectAllLabels(imageBytes: Buffer) {
    const [labels, moderationLabels] = await Promise.all([
      this.detectLabels(imageBytes),
      this.detectModerationLabels(imageBytes),
    ]);
    return { labels: labels ?? [], moderationLabels: moderationLabels ?? [] };
  }

  async detectLabels(imageBytes: Buffer) {
    try {
      const command = new DetectLabelsCommand({
        Image: { Bytes: imageBytes },
        MaxLabels: 10,
        MinConfidence: 75,
      });

      const response = await this._client.send(command);
      return response.Labels;
    } catch (error) {
      this.logger.error(error);
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

      const response = await this._client.send(command);
      return response.ModerationLabels;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'AWS Rekognition failed to detect moderation labels',
      );
    }
  }
}
