import { getLogger } from 'log4js';
import { resolve } from 'path';
import { getDB, getQuery, toCamelCase } from '../../util/database';

const logger = getLogger('search');

export function searchDatasets(req, res) {
  let query = req.query.q;
  let offset = +req.query.offset || 0;
  let limit = +req.query.limit || 15;
  let db = getDB();

  if (!query) {
    res.json({
      success: true,
      results: [],
      nextPage: false
    });
  }

  query = query.replace(/\+/g, ' ');

  getQuery(resolve(__dirname, './queries/search_datasets.sql'))
    .concatMap((sql) => db.query(sql, [query, offset, limit + 1]))
    .toArray()
    .subscribe((datasets) => {
      res.json({
        success: true,
        results: toCamelCase(datasets.slice(0, limit)),
        nextPage: datasets.length > limit
      });
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.json({
        success: false,
        message: error.message
      });
    });
}
