import * as p from './portal';

export default function attachPortalAPI(app) {

  /**
   * @api {get} /api/portals   Get all portal information
   * @apiName GetPortals
   * @apiGroup Portal
   *
   * @apiSuccess {Boolean}  success   Indicating whether the request is sucessful.
   * @apiSuccess {Object[]} portals   an array of portals.
   *
   * @apiError   {Boolean}  success   Indicating whether the request is sucessful.
   * @apiError   {String}   message   Error message.
   */
  app.get('/api/portals', p.getPortals);
}
