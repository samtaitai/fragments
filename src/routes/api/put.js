const responseHelper = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
    let jsonResponse;
  
    // PUT /fragments/:id
    if (req.params.id) {
      let result;
  
      try {
        result = await Fragment.byId(req.user, req.params.id); 
        const fragment = new Fragment({
          id: result.id,
          ownerId: result.ownerId,
          created: result.created,
          updated: result.updated,
          type: result.type,
          size: result.size
        });

        // If the Content-Type of the request does not match the existing fragment's type, returns an HTTP 400
        if (!Fragment.isSupportedType(fragment.type)) {
            jsonResponse = responseHelper.createErrorResponse('400', 'unsupported type');
            return res.status(404).json(jsonResponse);
        }

        // update
        await fragment.setData(req.body);
        const data = {
            fragment: {
              id: fragment.id,
              ownerId: fragment.ownerId,
              created: fragment.created,
              updated: fragment.updated,
              type: fragment.type,
              size: fragment.size,
            },
          };
        jsonResponse = responseHelper.createSuccessResponse(data);
        return res.status(200).json(jsonResponse);

      } catch (err) {
        console.log(err);
        // If no such fragment exists with the given id, returns an HTTP 404
        jsonResponse = responseHelper.createErrorResponse('404', 'unknown fragment');
        return res.status(404).json(jsonResponse);
      }
    }
  };