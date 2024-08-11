const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
    test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));
    
    test('authenticated users can update the existing fragment', async () => {
        const postRes = await request(app)
          .post('/v1/fragments')
          .auth('test_user1', 'runInBand1!')
          .send('Hello world')
          .set('Content-Type', 'text/plain');
    
        const testId = postRes.body.fragment.id;
        const res = await request(app)
        .put(`/v1/fragments/${testId}`)
        .auth('test_user1', 'runInBand1!')
        .send('Hello world is updated')
        .set('Content-Type', 'text/plain');
    
        expect(res.statusCode).toBe(200);
        const createdTime = new Date(res.body.fragment.created).getTime();
        const updatedTime = new Date(res.body.fragment.updated).getTime();
        expect(updatedTime).toBeGreaterThan(createdTime);
      });

    test('updating with unsupported type of fragment returns 400 error', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .auth('test_user1', 'runInBand1!')
        .send('Hello world')
        .set('Content-Type', 'text/plain');
  
      const testId = postRes.body.fragment.id;
      const res = await request(app)
      .put(`/v1/fragments/${testId}`)
      .auth('test_user1', 'runInBand1!')
      .send('This is fake video')
      .set('Content-Type', 'video/ogg');
  
      expect(res.statusCode).toBe(400);
    });

    test('updating with unknown fragment returns 404 error', async () => {
      await request(app)
        .post('/v1/fragments')
        .auth('test_user1', 'runInBand1!')
        .send('Hello world')
        .set('Content-Type', 'text/plain');
  
      const res = await request(app)
      .put(`/v1/fragments/no-such-id`)
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');
  
      expect(res.statusCode).toBe(404);
    });
});