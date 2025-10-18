import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@repo/nest-shared';
import { configureApp } from '@src/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestingFixtures } from './utils';

const basePath = '/v1/users';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let user1: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let user2: Awaited<ReturnType<PrismaService['user']['findFirstOrThrow']>>;
  let token1: string;
  let token2: string;
  const { createTestingModule, mockJwtGuard } = createTestingFixtures();

  beforeEach(async () => {
    const moduleFixture = await createTestingModule();

    app = moduleFixture.createNestApplication();
    configureApp(app);

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    user1 = await prismaService.user.findUniqueOrThrow({
      where: { handle: 'jon' },
    });
    user2 = await prismaService.user.findUniqueOrThrow({
      where: { handle: 'jon2' },
    });

    let payload = {
      sub: user1.id,
      email: user1.email,
      handle: user1.handle,
    };
    const secret = process.env.JWT_SECRET;
    token1 = new JwtService().sign(payload, { secret });
    payload = {
      sub: user2.id,
      email: user2.email,
      handle: user2.handle,
    };
    token2 = new JwtService().sign(payload, { secret });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe(`GET ${basePath}/:id`, () => {
    const userPublicPath = () => `${basePath}/${user1.id}`;

    it('no authentication', () => {
      return request(app.getHttpServer())
        .get(userPublicPath())
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.amIFollowing).toBeUndefined();
        });
    });

    it('with authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(userPublicPath())
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.amIFollowing).toBeDefined();
    });

    it('with id matching authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(userPublicPath())
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.amIFollowing).toBeUndefined();
    });
  });

  describe(`GET ${basePath}/:id/account`, () => {
    const accountPath = () => `${basePath}/${user1.id}/account`;

    it('valid', async () => {
      const response = await request(app.getHttpServer())
        .get(accountPath())
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('unauthorized', async () => {
      mockJwtGuard.canActivate.mockImplementationOnce(() => false);

      const response = await request(app.getHttpServer()).get(accountPath());

      expect(response.status).toBe(403);
    });
  });

  describe(`GET ${basePath}/:id/followers`, () => {
    const followersPath = () => `${basePath}/${user1.id}/followers`;

    it('valid', async () => {
      const response = await request(app.getHttpServer())
        .get(followersPath())
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe(`PATCH ${basePath}/:id/follow`, () => {
    const followPath = () => `${basePath}/${user1.id}/follow`;

    it('valid', async () => {
      const response = await request(app.getHttpServer())
        .put(followPath())
        .send({ follow: true })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it('conflict', async () => {
      const response = await request(app.getHttpServer())
        .put(followPath())
        .send({ follow: true })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(409);
    });

    it('bad request', async () => {
      const response = await request(app.getHttpServer())
        .put(followPath())
        .send({ follow: 1 })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(400);
      expect(response.body.follow).toBe('follow must be a boolean value');
    });

    it('unfollow valid', async () => {
      const response = await request(app.getHttpServer())
        .put(followPath())
        .send({ follow: false })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(204);
    });

    it('unfollow again invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch(followPath())
        .send({ follow: false })
        .set('Authorization', `Bearer ${token2}`);

      expect(response.status).toBe(404);
    });
  });
});
