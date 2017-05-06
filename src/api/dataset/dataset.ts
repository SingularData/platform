import { getLogger } from 'log4js';
import { resolve } from 'path';
import { isNaN } from 'lodash';
import { getDB, getQuery, toCamelCase } from '../../util/database';

const logger = getLogger('dataset');

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

export function getDataset(req, res) {
  let datasetId = +req.params.id;

  if (isNaN(datasetId)) {
    res.json({
      success: false,
      message: 'Invalid dataset ID.'
    });

    return;
  }

  let db = getDB();

  getQuery(resolve(__dirname, './queries/get_dataset.sql'))
    .concatMap((sql) => db.query(sql, [datasetId]))
    .toArray()
    .subscribe((results) => {
      if (results.length === 0) {
        res.json({
          success: false,
          message: 'Unable to find dataset with the input ID.'
        });

        return;
      }

      res.json({
        success: true,
        result: toCamelCase(results[0])
      });
    }, (error) => {
      logger.error('Unable to get dataset details: ', error);
      res.json({
        success: false,
        message: error.message
      });
    });
}

export function getDatasetRaw(req, res) {
  let datasetId = +req.params.id;

  if (isNaN(datasetId)) {
    res.json({
      success: false,
      message: 'Invalid dataset ID.'
    });

    return;
  }

  let db = getDB();

  db.query('SELECT raw FROM public.dataset WHERE id = $1::integer LIMIT 1', [datasetId])
    .toArray()
    .subscribe((results) => {
      if (results.length === 0) {
        res.json({
          success: false,
          message: 'Unable to find dataset with the input ID.'
        });

        return;
      }

      res.json({
        success: true,
        result: results[0].raw
      });
    },
    (error) => {
      logger.error('Unable to get raw metadata: ', error);
      res.json({
        success: false,
        message: error.message
      });
    }
  );
}
