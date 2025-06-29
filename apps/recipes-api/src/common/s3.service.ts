import { Inject, Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { awsConfig, type AwsConfigType } from './config/aws.config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  private s3: S3;
  constructor(
    @Inject(awsConfig.KEY)
    _awsConfig: AwsConfigType,
  ) {
    this.s3 = new S3(_awsConfig);
  }

  uploadFile(keyName: string, content: Buffer<ArrayBuffer>) {
    const params = {
      Bucket: 'jonrecipesbucket',
      Key: keyName,
      Body: content,
      ContentType: 'image/jpg',
    };
    this.s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
      } else {
        this.logger.log(`File uploaded successfully at ${data.Location}`);
      }
    });
  }
}
