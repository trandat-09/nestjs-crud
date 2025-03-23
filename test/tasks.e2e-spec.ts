import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { testDbConfig } from './test-db.config';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let accessToken: string;
  let tenantId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(testDbConfig)],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the DataSource instance
    dataSource = app.get(DataSource);

    // Create a tenant
    const tenantResponse = await request(app.getHttpServer())
      .post('/tenants')
      .send({ name: 'Test Tenant' })
      .expect(201);

    tenantId = tenantResponse.body.id;

    const emailPrefix = new Date().getTime();

    // Create a test user and get an access token
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test-${emailPrefix}@gmail.com`,
        password: 'testpassword',
        tenantId,
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: `test-${emailPrefix}@gmail.com`,
        password: 'testpassword',
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await dataSource.dropDatabase(); // Drop the database to clean up after tests
    await app.close();
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...createTaskDto, tenantId })
        .expect(201);

      expect(response.body).toMatchObject(createTaskDto);
    });
  });

  describe('/tasks (GET)', () => {
    it('should return an array of tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tenantId })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a task by id', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const createdTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...createTaskDto, tenantId })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${createdTask.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tenantId })
        .expect(200);

      expect(response.body).toMatchObject(createTaskDto);
    });

    it('should return 404 if task not found', async () => {
      await request(app.getHttpServer())
        .get('/tasks/999')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tenantId })
        .expect(404);
    });
  });

  describe('/tasks/:id (PATCH)', () => {
    it('should update a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const createdTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...createTaskDto, tenantId })
        .expect(201);

      const updateTaskDto = { title: 'Updated Task' };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${createdTask.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateTaskDto)
        .query({ tenantId })
        .expect(200);

      expect(response.body).toMatchObject(updateTaskDto);
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const createdTask = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...createTaskDto, tenantId })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/tasks/${createdTask.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tenantId })
        .expect(200);

      await request(app.getHttpServer())
        .get(`/tasks/${createdTask.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ tenantId })
        .expect(404);
    });
  });
});
