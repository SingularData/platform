import * as p from './portal';
import { recordAPIUsage } from '../../util/api';

export default function attachPortalAPI(app) {

  /**
   * @api {GET} /api/portals   Get all portal information
   * @apiName GetPortals
   * @apiGroup Portal
   *
   * @apiSuccess {Boolean}  success   Indicating whether the request is sucessful.
   * @apiSuccess {Object[]} portals   an array of portals.
   *
   * @apiError   {Boolean}  success   Indicating whether the request is sucessful.
   * @apiError   {String}   message   Error message.
   */
  app.get('/api/portals', recordAPIUsage('see portals', '/api/portals'), p.getPortals);

  /**
   * @api {GET} /api/portals/stats  Get portal statistics
   * @apiName GetPortalStats
   * @apiGroup Portal
   *
   * @apiParam (Query String) {Date}    date    date of stats
   * @apiParam (Query String) {String}  format  report format
   */
  app.get('/api/portals/stats', recordAPIUsage('get portal stats', '/api/portals/stats'), p.getPortalStats);
}
