import { getLogger } from 'log4js';
import { getDB, toCamelCase } from '../../util/database';

const logger = getLogger('portal');

export function getPortals(req, res) {
  let db = getDB();

  db.query('SELECT * FROM public.view_portal')
    .map((portal) => toCamelCase(portal))
    .toArray()
    .subscribe((portals) => {
      res.json({
        success: true,
        results: portals
      });
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.json({
        success: false,
        message: error.message
      });
    });
}
