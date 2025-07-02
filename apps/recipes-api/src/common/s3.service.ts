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
    this.cloudFrontBaseUrl = _awsConfig.cloudFrontBaseUrl
  }

  async uploadFile(keyName: string, content: Buffer<ArrayBuffer>) {
    const params = {
      Bucket: 'jonrecipesbucket',
      Key: `${keyName}.jpg`,
      Body: content,
      ContentType: 'image/jpg',
    };
    return new Promise<string>((resolve, reject) => {
      this.s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
        reject(err)
      } else {
        this.logger.log(`File uploaded successfully at ${data.Location}`);
        resolve(`${this.cloudFrontBaseUrl}/${params.Key}`);
      }
    });
    })
  }
}
