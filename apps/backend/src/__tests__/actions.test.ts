import request from 'supertest';
import { server } from '../main';
import app from '../app/app';

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints', () => {
  it('should fetch actions and credits', async () => {
    const response = await request(app).get('/actions');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('actions');
    expect(response.body).toHaveProperty('credits');
    expect(response.body).toHaveProperty('pendingActions');
  });

  it('should add a new action', async () => {
    const response = await request(app).post('/actions').send({ type: 'A' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Action added');
  });

  it('should return 400 for invalid action type', async () => {
    const response = await request(app).post('/actions').send({ type: 'D' });
    expect(response.status).toBe(400);
  });
});
