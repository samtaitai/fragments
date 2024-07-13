// src/routes/api/get.js
//const { readFragment, readFragmentData } = require('../../model/data');
const responseHelper = require('../../response');
// markdown-it exports a constructor function, not an object(class) with a markdownit property. hence, not { markdownit }
const markdownit = require('markdown-it');
const md = markdownit();
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const data = {
    fragments: [],
  };
  let jsonResponse;

  if (
    Object.getOwnPropertyNames(req.query).length == 0 &&
    Object.getOwnPropertyNames(req.params).length == 0
  ) {
    data.fragments = await Fragment.byUser(req.user);
    jsonResponse = responseHelper.createSuccessResponse(data);
    return res.status(200).json(jsonResponse);
  }

  // GET /fragments/?expand=1
  if (req.query) {
    if (req.query.expand == 1) {
      data.fragments = await Fragment.byUser(req.user, true);
      jsonResponse = responseHelper.createSuccessResponse(data);
      return res.status(200).json(jsonResponse);
    }
  }

  // GET /fragments/:id
  if (req.params.id) {
    const fragmentId = req.params.id.split('.')[0];
    let fragmentMetaData;

    try {
      fragmentMetaData = await Fragment.byId(req.user, fragmentId);
      const extensionRegex = /\.(\w+)$/;
      const match = req.path.match(extensionRegex);
      let fragmentData = await fragmentMetaData.getData(req.user, fragmentId);

      if (req.path.endsWith('/info')) {
        data.fragments.push(fragmentMetaData);
        jsonResponse = responseHelper.createSuccessResponse(data);
        return res.status(200).json(jsonResponse);
      }

      if (match) {
        // GET /fragments/:id.ext
        if (fragmentMetaData.type == 'text/markdown') {
          fragmentData = md.render(fragmentData.toString('utf8'));
          return res
            .status(200)
            .set({
              'Content-Type': 'text/html',
              'Content-Length': fragmentMetaData.size,
            })
            .send(fragmentData);
        } else {
          jsonResponse = responseHelper.createErrorResponse('415', 'unsupported type');
          return res.status(415).json(jsonResponse);
        }
      }
      return res
        .status(200)
        .set({
          'Content-Type': fragmentMetaData.type,
          'Content-Length': fragmentMetaData.size,
        })
        .send(fragmentData);
    } catch (err) {
      console.log(err);
      jsonResponse = responseHelper.createErrorResponse('404', 'unknown fragment');
      return res.status(404).json(jsonResponse);
    }
  }
};
