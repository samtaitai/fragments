// src/routes/api/get.js
//const { readFragment, readFragmentData } = require('../../model/data');
const responseHelper = require('../../response');
// markdown-it exports a constructor function, not an object(class) with a markdownit property. hence, not { markdownit }
const markdownit = require('markdown-it');
const md = markdownit();
const { Fragment } = require('../../model/fragment');
const sharp = require('sharp');
const TurndownService = require('turndown');
const Papa = require('papaparse');
const fs = require('fs');
const YAML = require('json-to-pretty-yaml');

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
      // if the id includes an optional extension (e.g., .txt or .png), the server attempts to convert the fragment to the type associated with that extension.
      // TODO: Conversion between all supported fragment types and conversions via .ext
      if (isMatch) {
        const extension = req.params.id.split('.')[1];
        // if original content type is txt/
        if (fragment.type.startsWith('text/')){
          // if ext is txt
          if (req.path.endsWith('txt')) {
            return res
            .status(200)
            .set({
              'Content-Type': 'text/plain',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // if ext is md
          else if (req.path.endsWith('md') && fragment.type.includes('text/html')) {
            fragmentData = htmlToMd(fragmentData);
            return res
            .status(200)
            .set({
              'Content-Type': 'text/md',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // if ext is html
          else if (req.path.endsWith('html') && fragment.type.includes('text/markdown')) {
            fragmentData = mdToHtml(fragmentData);
            return res
            .status(200)
            .set({
              'Content-Type': 'text/html',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          else if (req.path.endsWith('json') && fragment.type.includes('text/csv')) {
            fragmentData = csvToJson(fragmentData);
            return res
            .status(200)
            .set({
              'Content-Type': 'application/json',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          else {
            jsonResponse = responseHelper.createErrorResponse('415', 'unsupported type');
            return res.status(415).json(jsonResponse);
          }
        }
        // application
        else if (fragment.type.startsWith('application/')) {
          // if ext is yaml
          const yamlRegex = /ya?ml/
          if (yamlRegex.test(req.path) && fragment.type.includes('application/json')) {
            fragmentData = jsonToYaml(fragmentData);
            return res
            .status(200)
            .set({
              'Content-Type': 'application/yaml',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // is ext is json
          else if (req.path.endsWith('txt') && fragment.type.includes('application/yaml')) {
            return res
            .status(200)
            .set({
              'Content-Type': 'text/plain',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          else {
            jsonResponse = responseHelper.createErrorResponse('415', 'unsupported type');
            return res.status(415).json(jsonResponse);
          }
        }
        // image
        else if (fragment.type.startsWith('image/')) {
          // convert to png
          if (extension == 'png') {
            fragmentData = await sharp(fragmentData).png().toBuffer();
            return res
            .status(200)
            .set({
              'Content-Type': 'image/png',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // convert to jpg
          else if (extension == 'jpg') {
            fragmentData = await sharp(fragmentData).jpeg().toBuffer();
            return res
            .status(200)
            .set({
              'Content-Type': 'image/jpeg',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // convert to webp
          else if (extension == 'wepb') {
            fragmentData = await sharp(fragmentData).webp().toBuffer();
            return res
            .status(200)
            .set({
              'Content-Type': 'image/webp',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // convert to gif
          else if (extension == 'gif') {
            fragmentData = await sharp(fragmentData).gif().toBuffer();
            return res
            .status(200)
            .set({
              'Content-Type': 'image/gif',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          // convert to avif
          else if (extension == 'avif') {
            fragmentData = await sharp(fragmentData).avif().toBuffer();
            return res
            .status(200)
            .set({
              'Content-Type': 'image/avif',
              'Content-Length': fragment.size,
            })
            .send(fragmentData);
          }
          else {
            jsonResponse = responseHelper.createErrorResponse('415', 'unsupported type');
            return res.status(415).json(jsonResponse);
          }
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

  function mdToHtml(data) { return md.render(data.toString('utf8')); }
  function htmlToMd(data) {
    let turndownService = new TurndownService();
    return turndownService.turndown(data);
  }
  function csvToJson(data) { return Papa.parse(data); }
  function jsonToYaml(data) {
    const jsonData = YAML.stringify(data);
    return fs.writeFile('output.yaml', jsonData);
  }

};
