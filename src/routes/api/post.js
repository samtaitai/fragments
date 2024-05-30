const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const responseHelper = require('../../response');

module.exports = async (req, res) => {
  try {
    const fragmentData = req.body;
    const url = new URL('http://' + req.hostname);
    let newFragment = new Fragment({
      ownerId: 'a',
      type: req.headers['content-type'],
      size: req.body.length,
    });
    await newFragment.setData(fragmentData);

    const data = {
      fragment: {
        id: newFragment.id,
        ownerId: newFragment.ownerId,
        created: newFragment.created,
        updated: newFragment.updated,
        type: newFragment.type,
        size: newFragment.size,
      },
      location: url,
    };
    const jsonResponse = responseHelper.createSuccessResponse(data);
    res.status(201).json(jsonResponse);
  } catch (err) {
    logger.error({ err }, 'uncaughtException');
    throw err;
  }
};
