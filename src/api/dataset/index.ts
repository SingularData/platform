import * as d from './dataset';
import { recordAPIUsage } from '../../util/api';

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
  app.get('/api/dataset/search', recordAPIUsage('search dataset', '/api/dataset/search'), d.searchDatasets);

  /**
   * @api {GET} /api/dataset/:uuid    Get dataset details by dataset uuid
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameter) {Number} uuid      Dataset UUID
   * @apiParam (Query)     {Number} [version] Dataset version number
   *
   * @apiExample {GET} Example
   *    GET datarea.io/api/dataset/40ad6756-2b16-4718-8dff-aa6742d4375d
   *
   * @apiSuccessExample {JSON} Success-Response:
   *    {
   *      "success": true,
   *      "result": {
   *        "uuid": "40ad6756-2b16-4718-8dff-aa6742d4375d",
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
   *        "license": "MIT",
   *        "data": [
   *          {
   *            "name": "School Site",
   *            "description": "a csv list of school site",
   *            "format": "csv",
   *            "link": "school.csv"
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
  app.get('/api/dataset/:uuid', d.getDataset);

  /**
   * @api {GET} /api/dataset/raw/:uuid    Get dataset raw metadata by dataset uuid
   * @apiName GetDataset
   * @apiGroup Dataset
   *
   * @apiParam (Parameter) {Number} uuid      Portal dataset uuid
   * @apiParam (Query)     {Number} [version] Dataset version number
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
  app.get('/api/dataset/raw/:uuid', d.getDatasetRaw);

  /**
   * @api {GET} /api/dataset/history/:uuid   Get dataset history
   * @apiName GetDatasetHistory
   * @apiGroup Dataset
   *
   * @apiParam (Parameter) {Number} uuid Portal dataset ID MD5 code
   *
   * @apoSuccessExample {JSON} Success-Response:
   *    {
   *      "success": true,
   *      "results": [
   *        { "version": 3, "updatedTime": "Fri May 05 2017 23:22:14 GMT-0400 (EDT)" },
   *        { "version": 2, "updatedTime": "Fri May 02 2017 23:22:14 GMT-0400 (EDT)" }
   *      ]
   *    }
   *
   * @apiErrorExample {JSON} Error-Response:
   *    {
   *      "success": false,
   *      "message": "reason"
   *    }
   */
  app.get('/api/dataset/history/:uuid', d.getDatasetHistory);
}
