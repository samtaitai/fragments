// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // When authenticated users hit non-existent path, it should return 404
  test('authenticated users make any requests for resources that not exist', async () => {
    const res = await request(app).get('/v1/fragments/no_such_things').auth('test_user1', 'runInBand1!');
    expect(res.statusCode).toBe(404);
  });

});