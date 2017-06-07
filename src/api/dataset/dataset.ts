import { getLogger } from 'log4js';
import { resolve } from 'path';
import { isNaN } from 'lodash';
// import { search } from './pg-search';
import { search } from './es-search';
import { getDB, getQuery, toCamelCase } from '../../util/database';

const logger = getLogger('dataset');

export function searchDatasets(req, res) {
  let query = req.query.q;
  let offset = +req.query.offset || 0;
  let limit = +req.query.limit || 15;

  if (!query) {
    res.json({
      success: true,
      results: [],
      nextPage: false
    });
  }

  query = query.replace(/\+/g, ' ');

  search(query, offset, limit + 1)
    .subscribe((datasets) => {
      res.json({
        success: true,
        results: datasets.slice(0, limit),
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
  let uuid = req.params.uuid;

  if (!uuid) {
    res.json({
      success: false,
      message: 'Invalid dataset ID.'
    });

    return;
  }

  let db = getDB();
  let getDataset;

  if (req.query.version) {
    getDataset = getQuery(resolve(__dirname, './queries/get_dataset_version.sql'))
        .concatMap((sql) => db.query(sql, [uuid, +req.query.version]));
  } else {
    getDataset = getQuery(resolve(__dirname, './queries/get_dataset_latest.sql'))
        .concatMap((sql) => db.query(sql, [uuid]));
  }

  getDataset
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
  let datasetId = +req.params.uuid;

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

export function getDatasetHistory(req, res) {
  let uuid = req.params.uuid;
  let db = getDB();

  getQuery(resolve(__dirname, './queries/get_dataset_history.sql'))
    .concatMap((sql) => db.query(sql, [uuid]))
    .map((row) => toCamelCase(row))
    .toArray()
    .subscribe((results) => {
      res.json({
        success: true,
        result: results
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
