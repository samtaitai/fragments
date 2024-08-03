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
    let result;
    let fragmentData;
    const extensionRegex = /\.(\w+)$/;
    const isMatch = extensionRegex.test(req.path);
    const fragmentId = req.params.id.split('.')[0];

    try {
      // in :id.ext case, req.params.id looks like b67a04ab-afb1-4c23-ad45-75dd2706fbb8.html
      result = await Fragment.byId(req.user, fragmentId); 
      // Fix TypeError: Fragment.getData is not a function
      const fragment = new Fragment({
        id: result.id,
        ownerId: result.ownerId,
        created: result.created,
        updated: result.updated,
        type: result.type,
        size: result.size
      });
      fragmentData = await fragment.getData(); 

      // GET /fragments/:id/info
      if (req.path.endsWith('/info')) {
        data.fragments.push(fragment);
        // console.log(`fragment is `, JSON.stringify(fragment, null, 2));
        // console.log(`data is `, JSON.stringify(data, null, 2));
        jsonResponse = responseHelper.createSuccessResponse(data);
        return res.status(200).json(jsonResponse);
      }

      // GET /fragments/:id.ext
      if (isMatch) {
        if (fragment.type.includes('text/markdown')) {
          fragmentData = md.render(fragmentData.toString('utf8'));
          return res
            .status(200)
            .set({
              'Content-Type': 'text/html',
              'Content-Length': fragment.size,
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
          'Content-Type': fragment.type,
          'Content-Length': fragment.size,
        })
        .send(fragmentData);
    } catch (err) {
      console.log(err);
      jsonResponse = responseHelper.createErrorResponse('404', 'unknown fragment');
      return res.status(404).json(jsonResponse);
    }
  }
};
