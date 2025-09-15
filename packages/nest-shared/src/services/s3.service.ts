import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { awsConfig, type AwsConfigType } from '../configs/aws.config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  private _s3: S3;
  private _cloudFrontBaseUrl: string;
  private _s3BucketName: string;
  constructor(
    @Inject(awsConfig.KEY)
    _awsConfig: AwsConfigType,
  ) {
    this._s3 = new S3({
      endpoint: _awsConfig.s3EndpointUrl,
      forcePathStyle: _awsConfig.s3EndpointUrl ? true : undefined,
      credentials: {
        accessKeyId: _awsConfig.accessKeyId,
        secretAccessKey: _awsConfig.secretAccessKey,
      },
      region: _awsConfig.region,
    });
    this._cloudFrontBaseUrl = _awsConfig.cloudFrontBaseUrl;
    this._s3BucketName = _awsConfig.s3BucketName;
  }

  public get cloudFrontBaseUrl(): string {
    return this._cloudFrontBaseUrl;
  }

  async uploadFile(
    keyName: string,
    content: Buffer<ArrayBuffer>,
    contentType: string,
  ) {
    const params = {
      Bucket: this._s3BucketName,
      Key: keyName,
      Body: content,
      ContentType: contentType,
    };
    try {
      const result = await new Upload({
        client: this._s3,
        params,
      }).done();
      this.logger.log(`File uploaded successfully at ${result.Location}`);
    } catch (err) {
      this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
