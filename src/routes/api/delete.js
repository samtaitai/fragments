const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const responseHelper = require('../../response');

module.exports = async (req, res) => {
    // DELETE /fragments/:id
    let jsonResponse;
    let fragmentMetaData;
    try {
        if (req.params.id) {
            const fragmentId = req.params.id.split('.')[0];
            fragmentMetaData = await Fragment.byId(req.user, fragmentId);

            await Fragment.delete(req.user, fragmentId);

            return res
            .status(200)
            .set({
              'Content-Type': fragmentMetaData.type,
              'Content-Length': fragmentMetaData.size,
            })
            .send({"status": "ok"});
        }
        else {  
            jsonResponse = responseHelper.createErrorResponse('404', 'id is not found');
            return res.status(404).json(jsonResponse);
        }
    }
    catch(err) {
        logger.error({ err }, 'Error deleting existing fragment');
    }
};
