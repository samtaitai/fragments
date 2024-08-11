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
          type: req.headers['content-type'],
          size: result.size
        });

        //console.log('show me req body: ', req.body);
        console.log('show me req type header: ', req.headers);

        // If the Content-Type of the request does not match the existing fragment's type, returns an HTTP 400
        if (!Fragment.isSupportedType(req.headers['content-type'])) {
            jsonResponse = responseHelper.createErrorResponse('400', 'unsupported type');
            return res.status(400).json(jsonResponse);
        }
        // get actual data
        const fragmentData = await fragment.getData();
        // update
        await fragment.setData(fragmentData);
        const data = {
            fragment: {
              id: fragment.id,
              ownerId: fragment.ownerId,
              created: fragment.created,
              updated: fragment.updated,
              type: req.headers['content-type'],
              size: fragment.size,
            },
          };

        //console.log('after setData', data);  
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