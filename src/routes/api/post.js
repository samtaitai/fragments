const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const responseHelper = require('../../response');

module.exports = async (req, res) => {
  try {
    if (Buffer.isBuffer(req.body)) {
      const fragmentData = req.body;
      let newFragment = new Fragment({
        ownerId: req.user,
        type: req.headers['content-type'],
        size: req.body.length,
      });
      await newFragment.save(); // metadata
      await newFragment.setData(fragmentData); // data

      const data = {
        fragment: {
          id: newFragment.id,
          ownerId: newFragment.ownerId,
          created: newFragment.created,
          updated: newFragment.updated,
          type: newFragment.type,
          size: newFragment.size,
        },
        //location: `${process.env.API_URL}/${newFragment.id}`,
      };
      const jsonResponse = responseHelper.createSuccessResponse(data);
      return res.status(201).location(`${process.env.API_URL}/${newFragment.id}`).json(jsonResponse);
    } else {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }
  } catch (err) {
    logger.error({ err }, 'uncaughtException');
    throw err;
  }
};
