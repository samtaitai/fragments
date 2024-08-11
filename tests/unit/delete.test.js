const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
    test('unauthenticated requests are denied', () => request(app).delete('/v1/fragments').expect(401));
    
    test('authenticated users can delete the existing fragment', async () => {
        const postRes = await request(app)
          .post('/v1/fragments')
          .auth('test_user1', 'runInBand1!')
          .send('Hello world')
          .set('Content-Type', 'text/plain');
    
        const testId = postRes.body.fragment.id;
        // delete the fragment
        const deleteRes = await request(app).delete(`/v1/fragments/${testId}`).auth('test_user1', 'runInBand1!');
        expect(deleteRes.statusCode).toBe(200);

        // try to get, expect it to be unknown fragment
        const getRes = await request(app).get(`/v1/fragments/${testId}`).auth('test_user1', 'runInBand1!');
        expect(getRes.statusCode).toBe(404);
      });

    test('deleting unknown fragment returns 404 error', async () => {
      await request(app)
        .post('/v1/fragments')
        .auth('test_user1', 'runInBand1!')
        .send('Hello world')
        .set('Content-Type', 'text/plain');
  
      const res = await request(app)
      .put(`/v1/fragments/no-such-id`)
      .auth('test_user1', 'runInBand1!');
  
      expect(res.statusCode).toBe(404);
    });
});