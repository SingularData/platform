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
   * @api {GET} /api/dataset/:identifier    Get dataset details by dataset identifier
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameter) {Number}  identifier  Dataset identifier
   *
   * @apiExample {GET} Example
   *    GET datarea.io/api/dataset/1220f33599569d4155e4efd5401d2e61e55ab17cf9f90c2125a5409f4dcf253a94d3
   *
   * @apiSuccessExample {JSON} Success-Response:
   *    {
   *      "result": {
   *        "identifier": "1220f33599569d4155e4efd5401d2e61e55ab17cf9f90c2125a5409f4dcf253a94d3",
   *        "title": "Buffalo Schools",
   *        "publisher": "Buffalo Gov",
   *        "portal": "Buffalo Open Data",
   *        "platform": "CAKN",
   *        "portalLink": "dataset.url",
   *        "landingPage": "dataset.download.url",
   *        "issued": "Fri May 05 2017 23:22:14 GMT-0400 (EDT)"
   *        "modified": "Fri May 06 2017 23:22:14 GMT-0400 (EDT)",
   *        "keyword": [
   *          "education"
   *        ],
   *        "theme": [
   *          "education"
   *        ],
   *        "description": "open data",
   *        "license": "MIT",
   *        "distribution": [
   *          {
   *            "title": "School Site",
   *            "description": "a csv list of school site",
   *            "format": "csv",
   *            "accessURL": "school.csv",
   *            "downloadURL": "school.csv"
   *          }
   *        ],
   *        "version": 2
   *      }
   *    }
   *
   * @apiErrorExample {JSON} Error-Response:
   *    {
   *      "success": false,
   *      "message": "reason"
   *    }
   */
  app.get('/api/dataset/:identifier', d.getDataset);

  /**
   * @api {GET} /api/dataset/raw/:identifier    Get dataset raw metadata by dataset identifier
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameter) {Number} identifier  Portal dataset uuid
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
  app.get('/api/dataset/raw/:identifier', d.getDatasetRaw);

  /**
   * @api {POST} /api/dataset/history    Get dataset history
   * @apiName GetDatasetHistory
   * @apiGroup Dataset
   *
   * @apiParam {String} portalId           Dataset portal id
   * @apiParam {String} portalDatasetId    Dataset portal id
   *
   * @apoSuccessExample {JSON} Success-Response:
   *    {
   *      "success": true,
   *      "result": [
   *        {
   *          "version": 3,
   *          "identifier": "#3",
   *          "modified": "Fri May 05 2017 23:22:14 GMT-0400 (EDT)"
   *        },
   *        {
   *          "version": 2,
   *          "identifier": "#2",
   *          "modified": "Fri May 02 2017 23:22:14 GMT-0400 (EDT)"
   *        }
   *      ]
   *    }
   *
   * @apiErrorExample {JSON} Error-Response:
   *    {
   *      "success": false,
   *      "message": "reason"
   *    }
   */
  app.get('/api/dataset/history/:portalId/:portalDatasetId', d.getDatasetHistory);
}
