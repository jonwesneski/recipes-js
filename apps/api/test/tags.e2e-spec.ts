import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { configureApp } from 'src/common';
import { PrismaService } from 'src/common/prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

//const basePath = '/v1/tags';
const tagNamesPath = `/v1/tag-names`;

describe('TagsController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`GET ${tagNamesPath}`, () => {
    it('no query params', () => {
      return request(app.getHttpServer())
        .get(tagNamesPath)
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.pagination).toBeDefined();
        });
    });

    it('iterate until cursor is null', async () => {
      const data: { name: string }[] = [];
      for (let i = 1; i < 10; i++) {
        data.push({ name: `tag-${i}` });
      }
      await prismaService.tag.createMany({
        data,
      });

      let cursorId = 0;
      let loops = 0; // don't want to loop forever in case of an error
      while (cursorId !== null || loops < 5) {
        const response = await request(app.getHttpServer())
          .get(tagNamesPath)
          .query({ cursorId, take: 4 })
          .expect(200);

        expect(response.body.pagination.totalRecords).toBeGreaterThan(0);
        cursorId = response.body.pagination.nextCursor;
        loops++;
      }

      expect(cursorId).toBeNull();
    });
  });
});
