const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(res.status).toEqual(201);
  });

  test('responses include all necessary and expected properties and these values match what you expect for a given request', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(res.body.fragment.ownerId).toEqual('a');
    expect(res.body.fragment.type).toEqual('text/plain');
  });

  test('POST response includes a Location header with a full URL to GET the created fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    //expect(res.body.location).toEqual('http://127.0.0.1/');
    expect(res.header.location).toEqual(process.env.API_URL);
  });

  test('a fragment with an unsupported type should throw error', () => {
    expect(() => new Fragment({ ownerId: '1234', type: 'supportType' })).toThrow();
  });
});
