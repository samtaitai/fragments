// tests/unit/get.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // test('incorrect credentials are denied', () =>
  //   request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // test('authenticated users get a fragments array', async () => {
  //   const res = await request(app).get('/v1/fragments').auth('test_user1', 'runInBand1!');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(Array.isArray(res.body.fragments)).toBe(true);
  // });

  // GET /fragments/?expand=1
  test('the fragments array has the matching owner id info', async () => {
    // post example fragment first to get the populated fragment array
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

  // // GET /fragments/:id
  // test('return a current user fragment data with the given id', async () => {
  //   // post example fragment first to get its id
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('test_user1', 'runInBand1!')
  //     .send('Hello world')
  //     .set('Content-Type', 'text/plain')
  //     .get(`/v1/fragments/${res.body.fragments[0].id}`).auth('test_user1', 'runInBand1!');

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(res.headers['Content-Type']).toBe(`${res.body.fragments[0].type}`);
  //   expect(res.headers['Content-Type']).toBe(`${res.body.fragments[0].size}`);
  //   expect(res.text).toBe('Hello world');
  // });

  // GET /fragments/:id error case
  test('If the id does not represent a known fragment, returns an HTTP 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/no-such-id')
      .auth('test_user1', 'runInBand1!');
    expect(res.statusCode).toBe(404);
  });

  // // GET /fragments/:id.ext
  // test('convert markdown data to html', async () => {
  //   // post example fragment first to get its id
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('test_user1', 'runInBand1!')
  //     .send('# Hello world')
  //     .set('Content-Type', 'text/markdown')
  //     .get(`/v1/fragments/${res.body.fragments[0].id}.html`).auth('test_user1', 'runInBand1!');

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(res.body.fragments[0].type).toBe('text/html');
  // });

  // // GET /fragments/:id/info
  // test('returns an existing fragment metadata', async () => {
  //   // post example fragment first to get its id
  //   const res = await request(app)
  //     .post('/v1/fragments')
  //     .auth('test_user1', 'runInBand1!')
  //     .send('Hello world')
  //     .set('Content-Type', 'text/plain')
  //     .get(`/v1/fragments/${res.body.fragments[0].id}/info`).auth('test_user1', 'runInBand1!');

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.status).toBe('ok');
  //   expect(res.body.fragments[0].type).toBe('text/plain');
  // });
});
