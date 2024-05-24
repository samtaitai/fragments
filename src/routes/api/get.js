// src/routes/api/get.js
const responseHelper = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const data = {
    fragments: [],
  }
  
  const jsonResponse = responseHelper.createSuccessResponse(data);
  res.status(200).json(jsonResponse);
};
