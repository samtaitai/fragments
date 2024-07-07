const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(res.status).toBe(201);
  });

  test('responses include all necessary and expected properties and these values match what you expect for a given request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(res.body.fragment.ownerId).toBe('d4dd23a6e252fc26445422a6b5480fab917d667fd023b35c444c653148cd3520');
    expect(res.body.fragment.type).toBe('text/plain');
  });

  test('POST response includes a Location header with a full URL to GET the created fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(res.header.location).toBe(process.env.API_URL);
  });

  test('a fragment with an unsupported type should return HTTP 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'unsupport/type');

    expect(res.status).toBe(415);
  });
});
