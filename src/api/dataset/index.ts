import * as d from './dataset';

export default function attachDatasetAPI(app) {

  /**
   * @api {GET} /api/dataset/search   Search open dataset with keywords
   * @apiName SearchDatasets
   * @apiGroup Dataset
   *
   * @apiParam (Query String) {String} q Query keywords.
   *
   * @apiSuccess {Boolean}  success   Indicating whether the request is sucessful.
   * @apiSuccess {Object}   results   Search result.
   *
   * @apiError   {Boolean}  success   Indicating whether the request is sucessful.
   * @apiError   {String}   message   Error message.
   */
  app.get('/api/dataset/search', d.searchDatasets);

  /**
   * @api {GET} /api/dataset/:id    Get dataset details by id
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameters) {Number} id Dataset ID
   *
   * @apiExample {GET} Example
   *    GET datarea.io/api/dataset/1
   *
   * @apiSuccessExample {JSON} Success-Response:
   *    {
   *      "success": true,
   *      "result": {
   *        "id": 1,
   *        "dataPortalId": "34lkhgj123",
   *        "name": "Buffalo Schools",
   *        "publisher": "Buffalo Gov",
   *        "portal": "Buffalo Open Data",
   *        "platform": "CAKN",
   *        "portalLink": "dataset.url",
   *        "dataLink": "dataset.download.url",
   *        "createdTime": "Fri May 05 2017 23:22:14 GMT-0400 (EDT)"
   *        "updatedTime": "Fri May 06 2017 23:22:14 GMT-0400 (EDT)",
   *        "tags": [
   *          "education"
   *        ],
   *        "categories": [
   *          "education"
   *        ],
   *        "descriptions": "open data",
   *        "region": "Buffalo, NY",
   *        "license": "MIT"
   *      }
   *    }
   *
   * @apiErrorExample {JSON} Error-Response:
   *    {
   *      "success": false,
   *      "message": "reason"
   *    }
   */
  app.get('/api/dataset/:id', d.getDataset);

  /**
   * @api {GET} /api/dataset/raw/:id    Get dataset raw metadata by id
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameters) {Number} id Dataset ID
   *
   * @apoSuccessExample {JSON} Success-Response:
   *    {
   *      "success": true,
   *      "result": {}
   *    }
   *
   * @apiErrorExample {JSON} Error-Response:
   *    {
   *      "success": false,
   *      "message": "reason"
   *    }
   */
  app.get('/api/dataset/raw/:id', d.getDatasetRaw);
}
