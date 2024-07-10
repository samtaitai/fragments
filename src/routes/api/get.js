// src/routes/api/get.js
//const { readFragment, readFragmentData } = require('../../model/data');
const responseHelper = require('../../response');
// markdown-it exports a constructor function, not an object(class) with a markdownit property. hence, not { markdownit }
const markdownit = require('markdown-it');
const md = markdownit();
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const data = {
    fragments: [],
  };
  let jsonResponse;

  // GET /fragments/?expand=1
  // returns expanded fragment metadata for an authenticated user
  if (req.query) {
    if (req.query.expand == 1) {
      data.fragments = await Fragment.byUser(req.user, true);
      jsonResponse = responseHelper.createSuccessResponse(data);
      res.status(200).json(jsonResponse);
    } else {
      data.fragments = await Fragment.byUser(req.user);
      jsonResponse = responseHelper.createSuccessResponse(data);
      res.status(200).json(jsonResponse);
    }
  }
  // GET /fragments/:id/info
  // returns an existing fragment's metadata
  else if (req.params.id && req.path.endsWith('/info')) {
    data.fragments.push(Fragment.byId(req.user, req.params.id));
    res.status(200).json(jsonResponse);
  }
  // GET /fragments/:id
  // returns an existing fragment's data with the expected Content-Type
  else if (req.params.id) {
    let fragmentData = Fragment.getData(req.user, req.params.id);
    // If the id does not represent a known fragment, returns an HTTP 404
    if (!fragmentData) {
      res.status(404).json({ error: 'No fragment with the id' });
    }

    // GET /fragments/:id.ext
    // If the id includes an optional extension (e.g., .txt or .png), the server attempts to convert the fragment, supports text/markdown -> text/html for now
    if (req.params.ext && req.params.ext == 'html') {
      if (data.fragments[0].type == 'text/markdown') {
        fragmentData = md.render(fragmentData);
      }
      res
        .status(200)
        .set({
          'Content-Type': contentType.parse(fragmentData).type,
          'Content-Length': data.fragments[0].size,
        })
        .send(fragmentData);
    } else {
      res.status(415).json({ error: 'Unsupported type to convert' });
    }

    res
      .status(200)
      .set({
        'Content-Type': data.fragments[0].type,
        'Content-Length': data.fragments[0].size,
      })
      .send(fragmentData);
  } else {
    // GET /fragments
    data.fragments = await Fragment.byUser(req.user);

    // if any of previous res is executed, this line won't be executed
    res.status(200).json(jsonResponse);
  }
};
