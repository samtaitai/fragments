// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment.js');

// Create a router on which to mount our API endpoints
const router = express.Router();

router.get('/fragments', require('./get'));

router.get('/fragments?expand=1', require('./get'));

router.get('/fragments/:id', require('./get'));

router.get('/fragments/:id/info', require('./get'));

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      /* if content type is parsible(supported) `req.body` will be a buffer
      If not, `req.body` will be equal to an empty Object `{}` and Buffer.isBuffer(req.body) is false */
      const { type } = contentType.parse(req);

      // Fragment.isSupportedType(type) is false, Buffer.isBuffer(req.body) will be false.
      return Fragment.isSupportedType(type);
    },
  });

router.post('/fragments', rawBody(), require('./post'));

router.delete('/fragments/:id', require('./delete'));

module.exports = router;
