// src/routes/api/get.js
//const { readFragment, readFragmentData } = require('../../model/data');
const responseHelper = require('../../response');
// markdown-it exports a constructor function, not an object(class) with a markdownit property. hence, not { markdownit }
// const markdownit = require('markdown-it');
// const md = markdownit();
// const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const data = {
    fragments: [],
  };
  let jsonResponse;

  if (!req.query && !req.params) {
    data.fragments = await Fragment.byUser(req.user);
    jsonResponse = responseHelper.createSuccessResponse(data);
    res.status(200).json(jsonResponse);
  }

  // GET /fragments/?expand=1
  if (req.query) {
    if (req.query.expand == 1) {
      data.fragments = await Fragment.byUser(req.user, true);
      jsonResponse = responseHelper.createSuccessResponse(data);
      res.status(200).json(jsonResponse);
    }
  }

  // GET /fragments/:id
  if (req.params.id) {
    // GET /fragments/:id/info
    if (req.path.endsWith('/info')) {
      // let fragmentData = await Fragment.byId(req.user, req.params.id);
      // data.fragments.push(fragmentData);
      // res.status(200).json(jsonResponse);
    }
    data.fragments = await Fragment.byUser(req.user, true);
    let found = data.fragments.filter((f) => f.id == req.params.id)[0];
    // If the id does not represent a known fragment, returns an HTTP 404
    if (!found) {
      jsonResponse = responseHelper.createErrorResponse('404', 'unknown fragment');
      res.status(404).json(jsonResponse);
    } else {
      let fragmentData = await Fragment.byId(req.user, req.params.id);
      res
        .status(200)
        .set({
          'Content-Type': found.type,
          'Content-Length': found.size,
        })
        .send(fragmentData);
    }
  }
  // GET /fragments/:id.ext
  // if (req.params.ext && req.params.ext == 'html') {
  //   if (data.fragments[0].type == 'text/markdown') {
  //     let fragmentData = md.render(fragmentData);
  //   }
  //   res
  //     .status(200)
  //     .set({
  //       'Content-Type': contentType.parse(fragmentData).type,
  //       'Content-Length': data.fragments[0].size,
  //     })
  //     .send(fragmentData);
  // } else {
  //   res.status(415).json({ error: 'Unsupported type to convert' });
  // }
};
