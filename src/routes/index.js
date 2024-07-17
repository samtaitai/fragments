// src/routes/index.js

const express = require('express');
const responseHelper = require('../response');
const { hostname } = require('os');

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();

// Our authentication middleware
const { authenticate } = require('../auth');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * ./api/index.js will handle GET request at '/v1'
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const data = {
    author,
    githubUrl: 'https://github.com/samtaitai/fragments',
    version,
    hostname: hostname()
  }
  const jsonResponse = responseHelper.createSuccessResponse(data);
  res.status(200).json(jsonResponse);
});

module.exports = router;
