import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { awsConfig, type AwsConfigType } from '../configs/aws.config';

type S3ImageDataType = { s3BucketKeyName: string; s3ImageUrl: string };

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  private s3: S3;
  private _cloudFrontBaseUrl: string;
  constructor(
    @Inject(awsConfig.KEY)
    _awsConfig: AwsConfigType,
  ) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: _awsConfig.accessKeyId,
        secretAccessKey: _awsConfig.secretAccessKey,
      },
      region: _awsConfig.region,
    });
    this._cloudFrontBaseUrl = _awsConfig.cloudFrontBaseUrl;
  }

  async uploadFile(keyName: string, content: Buffer<ArrayBuffer>) {
    const params = {
      Bucket: 'jonrecipesbucket',
      Key: `${keyName}.jpg`,
      Body: content,
      ContentType: 'image/jpg',
    };
    try {
      const result = await new Upload({
        client: this.s3,
        params,
      }).done();
      this.logger.log(`File uploaded successfully at ${result.Location}`);
    } catch (err) {
      this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
      throw err;
    }
  }

  makeS3ImageUrl(
    userId: string,
    id: string,
    stepIndex?: number,
  ): S3ImageDataType {
    var s3BucketKeyName = `${userId}/${id}`;
    if (stepIndex !== undefined) {
      s3BucketKeyName += `/step-${stepIndex}`;
    } else {
      s3BucketKeyName += `/main`;
    }
    return {
      s3BucketKeyName,
      s3ImageUrl: `${this._cloudFrontBaseUrl}/${s3BucketKeyName}`,
    };
  }
}
