import { INestApplication } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { configureApp } from '@src/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestingFixtures } from './utils';

const basePath = '/';
const statusPath = `${basePath}status`;
const healthPath = `${basePath}health`;

describe('HealthCheckController (e2e)', () => {
  let app: INestApplication<App>;
  let memoryHealthIndicator: MemoryHealthIndicator;
  let diskStorageIndicator: DiskHealthIndicator;
  const { createTestingModule } = createTestingFixtures();

  beforeEach(async () => {
    const moduleFixture = await createTestingModule();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    memoryHealthIndicator = app.get<MemoryHealthIndicator>(
      MemoryHealthIndicator,
    );
    diskStorageIndicator = app.get<DiskHealthIndicator>(DiskHealthIndicator);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`GET ${statusPath}`, () => {
    it('valid', () => {
      return request(app.getHttpServer())
        .get(statusPath)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeUndefined();
        });
    });
  });

  describe(`GET ${healthPath}`, () => {
    it('valid', () => {
      const diskSpy = jest.spyOn(diskStorageIndicator, 'checkStorage');
      diskSpy.mockImplementationOnce(async () =>
        Promise.resolve({
          storage: { status: 'up' },
        } as HealthIndicatorResult<string>),
      );
      const heapSpy = jest.spyOn(memoryHealthIndicator, 'checkHeap');
      heapSpy.mockImplementationOnce(async () =>
        Promise.resolve({
          heap: {
            status: 'up',
          },
        } as HealthIndicatorResult<string>),
      );
      const rssSpy = jest.spyOn(memoryHealthIndicator, 'checkRSS');
      rssSpy.mockImplementationOnce(async () =>
        Promise.resolve({
          rss: {
            status: 'up',
          },
        } as HealthIndicatorResult<string>),
      );

      return request(app.getHttpServer())
        .get(healthPath)
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.info).toBeDefined();
          expect(res.body.error).toEqual({});
          expect(res.body.details).toBeDefined();
        });
    });

    it('invalid', () => {
      const diskSpy = jest.spyOn(diskStorageIndicator, 'checkStorage');
      diskSpy.mockResolvedValueOnce({
        status: { status: 'down' },
      } as HealthIndicatorResult<string>);

      return request(app.getHttpServer())
        .get(healthPath)
        .expect(503)
        .expect((res) => {
          expect(res.body.status).toBe('error');
          expect(res.body.info).toBeDefined();
          expect(res.body.error).not.toEqual({});
          expect(res.body.details).toBeDefined();
        });
    });
  });
});
