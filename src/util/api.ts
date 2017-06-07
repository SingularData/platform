import { Observable } from 'rxjs';
import { getLogger } from 'log4js';
// import { RxHR } from '@akanass/rx-http-request';
import { getDB } from './database';

const logger = getLogger('api');

/**
 * Express middleware to record the api usage
 */
export function recordAPIUsage(name, url) {
  return (req, res, next) => {

    /**
     * Recording the api usage has nothing to do with the API, so release the
     * request first.
     */
    next();

    let db = getDB();
    let ipLoc, apiID;

    let getAPI = db.query('SELECT id FROM report.api WHERE api_url = $1::text LIMIT 1', [url])
      .toArray()
      .concatMap((results) => {
        if (results.length === 1) {
          return db.query('INSERT INTO report.api_usage (api_id, time) VALUES ($1::integer, now())', [results[0].id]);
        }

        let sql = `
          WITH new_api AS (
            INSERT INTO report.api (api_url, name) VALUES ($1::text, $2::text) RETURNING id
          )
          INSERT INTO report.api_usage (api_id, time) VALUES (
            (SELECT id FROM new_api),
            now()
          )
        `;

        return db.query(sql, [url, name]);
      });

    // let getIP = RxHR.get('http://freegeoip.net/json/' + req.ip, { json: true })
    //   .do((result: any) => ipLoc = [result.city, result.region_name, result.country_name].join(', '));

    getAPI
      .catch((err) => {
        logger.error(err);
        return Observable.empty();
      })
      .subscribe();
  };
}
