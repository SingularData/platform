import * as search from './search';

export default function attachSearchAPI(app) {

  /**
   * @api {get} /api/search   Search open dataset with keywords
   * @apiName SearchData
   * @apiGroup Search
   *
   * @apiParam (Query String) {String} q Query keywords.
   *
   * @apiSuccess {Boolean}  success   Indicating whether the request is sucessful.
   * @apiSuccess {Object}   results   Search result.
   *
   * @apiError   {Boolean}  success   Indicating whether the request is sucessful.
   * @apiError   {String}   message   Error message.
   */
  app.get('/api/search', search.searchDatasets);
}
