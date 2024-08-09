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
        const res = await request(app).put(`/v1/fragments/${testId}`).auth('test_user1', 'runInBand1!');
    
        expect(res.statusCode).toBe(200);
        const createdTime = new Date(res.body.fragment.created).getTime();
        const updatedTime = new Date(res.body.fragment.updated).getTime();
        expect(updatedTime).toBeGreaterThan(createdTime);
      });
});