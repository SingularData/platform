import { getLogger } from 'log4js';
import { getDB, toCamelCase } from '../../util/database';

const logger = getLogger('portal');

export function getPortals(req, res) {
  let db = getDB();
  let query = `
    SELECT * FROM public.view_portal AS vp
    ORDER BY vp.platform, vp.name, vp.region
  `;

  db.query(query)
    .map((portal) => toCamelCase(portal))
    .toArray()
    .subscribe((portals) => {
      res.json({
        success: true,
        portals: portals
      });
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.json({
        success: false,
        message: error.message
      });
    });
}
