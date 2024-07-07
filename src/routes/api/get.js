// src/routes/api/get.js
const { readFragment } = require('../../model/data');
const responseHelper = require('../../response');
const { listFragments, } = require('./data');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const data = {
    fragments: [],
  }
  // GET /fragments
  data.fragments = listFragments(req.user);

  // GET /fragments/?expand=1
  if (req.query && req.query.expand == 1) {
    data.fragments = listFragments(req.user, req.query.expand);
  }

  // GET /fragments/:id
  if (req.params.id) {
    data.fragments = readFragment(req.user, req.params.id);
  }

  // GET /fragments/:id/info
  if (req.params.id && req.path.endsWith('/info')) {
    data.fragments = readFragment(req.user, req.params.id);
  }

  // GET /fragments/:id.ext
  
  const jsonResponse = responseHelper.createSuccessResponse(data);
  res.status(200).json(jsonResponse);
};
