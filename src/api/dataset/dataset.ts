import { getLogger } from 'log4js';
import { resolve } from 'path';
import { isNaN } from 'lodash';
import { get } from 'config';
import { Observable } from 'rxjs';
// import { search } from './pg-search';
import { search } from './es-search';
import { getDB, getQuery, toCamelCase } from '../../util/database';

const logger = getLogger('dataset');
const maxTimeout = +get('timeout');

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

  let datasets = [];

  search(query, offset, limit + 1)
    .timeout(maxTimeout)
    .subscribe((results) => {
      datasets = results;
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.json({
        success: false,
        message: error.message
      });
    }, () => {
      res.json({
        success: true,
        results: datasets.slice(0, limit),
        nextPage: datasets.length > limit
      });
    });
}

export function getDataset(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.json({
      success: false,
      message: 'Invalid dataset UUID.'
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

  let dataset;

  getDataset
    .timeout(maxTimeout)
    .subscribe((result) => {
      dataset = result;
    }, (error) => {
      logger.error('Unable to get dataset details: ', error);
      res.json({
        success: false,
        message: error.message
      });
    }, () => {
      if (dataset) {
        res.json({
          success: true,
          result: toCamelCase(dataset)
        });
      } else {
        res.json({
          success: false,
          message: 'Unable to find dataset with the input ID.'
        });
      }
    });
}

export function getDatasetRaw(req, res) {
  let uuid = +req.params.uuid;

  if (!uuid) {
    res.json({
      success: false,
      message: 'Invalid dataset UUID.'
    });

    return;
  }

  let db = getDB();
  let getDataset;

  if (req.query.version) {
    getDataset = getQuery(resolve(__dirname, './queries/get_dataset_raw_version.sql'))
        .concatMap((sql) => db.query(sql, [uuid, +req.query.version]));
  } else {
    getDataset = getQuery(resolve(__dirname, './queries/get_dataset_raw_latest.sql'))
        .concatMap((sql) => db.query(sql, [uuid]));
  }

  let dataset;

  getDataset
    .subscribe((result) => {
      dataset = result;
    },
    (error) => {
      logger.error('Unable to get raw metadata: ', error);
      res.json({
        success: false,
        message: error.message
      });
    },
    () => {
      if (dataset) {
        res.json({
          success: false,
          message: 'Unable to find dataset with the input ID.'
        });
      } else {
        res.json({
          success: true,
          result: dataset
        });
      }
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
