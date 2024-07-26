const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const responseHelper = require('../../response');

module.exports = async (req, res) => {
    // DELETE /fragments/:id
    let jsonResponse;
    try {
        if (req.params.id) {
            const fragmentId = req.params.id.split('.')[0];
            await Fragment.delete(req.user, fragmentId);

            return res
            .status(200)
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
