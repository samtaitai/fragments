// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // if posting nothing, await ddbDocClient.send(command) cause error
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('test_user1', 'runInBand1!');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // GET /fragments/?expand=1
  test('the fragments array has the matching owner id info', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    const res = await request(app).get('/v1/fragments/?expand=1').auth('test_user1', 'runInBand1!');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toBe(
      'd4dd23a6e252fc26445422a6b5480fab917d667fd023b35c444c653148cd3520'
    );
  });

  // GET /fragments/:id
  test('returns an existing fragment data with the expected Content-Type', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(postRes.statusCode).toBe(201);
    const testId = postRes.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${testId}`).auth('test_user1', 'runInBand1!');

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toContain('text/plain');
  });

  // GET /fragments/:id error case
  test('If the id does not represent a known fragment, returns an HTTP 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/no-such-id')
      .auth('test_user1', 'runInBand1!');
    expect(res.statusCode).toBe(404);
  });

  // GET /fragments/:id/info
  test('returns an existing fragment metadata', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('Hello world')
      .set('Content-Type', 'text/plain');

    expect(postRes.statusCode).toBe(201);
    const testId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${testId}/info`)
      .auth('test_user1', 'runInBand1!');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].type).toBe('text/plain');
  });

  // GET /fragments/:id.ext
  test('convert markdown data to html', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('# this is h1 tag')
      .set('Content-Type', 'text/markdown');

    expect(postRes.statusCode).toBe(201);
    const testId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${testId}.html`)
      .auth('test_user1', 'runInBand1!');

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toContain('text/html');
  });

  test('convert csv data to json', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test_user1', 'runInBand1!')
      .send('ontario,toronto,yonge')
      .set('Content-Type', 'text/csv');

    expect(postRes.statusCode).toBe(201);
    const testId = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${testId}.json`)
      .auth('test_user1', 'runInBand1!');

    expect(res.statusCode).toBe(200);
    expect(res.header['content-type']).toContain('application/json');
  });
});
