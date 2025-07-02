import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { awsConfig, type AwsConfigType } from './config/aws.config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  private s3: S3;
  private cloudFrontBaseUrl: string;
  constructor(
    @Inject(awsConfig.KEY)
    _awsConfig: AwsConfigType,
  ) {
    this.s3 = new S3({
      accessKeyId: _awsConfig.accessKeyId,
      secretAccessKey: _awsConfig.secretAccessKey,
      region: _awsConfig.region,
    });
    this.cloudFrontBaseUrl = _awsConfig.cloudFrontBaseUrl;
  }

  async uploadFile(keyName: string, content: Buffer<ArrayBuffer>) {
    const params = {
      Bucket: 'jonrecipesbucket',
      Key: `${keyName}.jpg`,
      Body: content,
      ContentType: 'image/jpg',
    };
    try {
      const result = await this.s3.upload(params).promise();
      this.logger.log(`File uploaded successfully at ${result.Location}`);
      return `${this.cloudFrontBaseUrl}/${params.Key}`;
    } catch (err) {
      this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
