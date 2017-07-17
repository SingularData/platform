import { getLogger } from 'log4js';
import { resolve } from 'path';
import { isNaN } from 'lodash';
import { get } from 'config';
import { Observable } from 'rxjs';
// import { search } from './pg-search';
import { search } from './es-search';
import { query, getQuery, toCamelCase } from '../../util/database';
import { Dataset } from '@singular-data/dataset-spec';

const logger = getLogger('dataset');

export function searchDatasets(req, res) {
  let query = req.query.q;
  let offset = +req.query.offset || 0;
  let limit = +req.query.limit || 15;

  if (!query) {
    res.json({
      results: [],
      nextPage: false
    });
  }

  query = decodeURIComponent(query);

  let datasets = [];

  search(query, offset, limit + 1)
    .subscribe((results) => {
      datasets = results;
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.status(500).json({ message: error.message });
    }, () => {
      res.json({
        results: datasets.slice(0, limit),
        nextPage: datasets.length > limit
      });
    });
}

export function getDataset(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  let getData;

  if (req.query.version) {
    getData = getQuery(resolve(__dirname, './queries/get_dataset_version.sql'))
        .concatMap((sql) => query(sql, [uuid, +req.query.version]));
  } else {
    getData = getQuery(resolve(__dirname, './queries/get_dataset_latest.sql'))
        .concatMap((sql) => query(sql, [uuid]));
  }

  let dataset: Dataset;

  getData
    .subscribe((result) => {
      dataset = toCamelCase(result) as Dataset;
    }, (error) => {
      logger.error('Unable to get dataset details: ', error);
      res.status(500).json({ message: error.message });
    }, () => {
      if (dataset) {
        res.json({ result: dataset });
      } else {
        res.status(400).json({ message: 'Unable to find dataset with the input ID.' });
      }
    });
}

export function getDatasetRaw(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  let getData;

  if (req.query.version) {
    getData = getQuery(resolve(__dirname, './queries/get_dataset_raw_version.sql'))
        .concatMap((sql) => query(sql, [uuid, +req.query.version]));
  } else {
    getData = getQuery(resolve(__dirname, './queries/get_dataset_raw_latest.sql'))
        .concatMap((sql) => query(sql, [uuid]));
  }

  let dataset;

  getData
    .subscribe((result) => {
      dataset = result.raw;
    },
    (error) => {
      logger.error('Unable to get raw metadata: ', error);
      res.status(500).json({ message: error.message });
    },
    () => {
      if (dataset) {
        res.json({ result: dataset });
      } else {
        res.status(400).json({ message: 'Unable to find dataset with the input ID.' });
      }
    }
  );
}

export function getDatasetHistory(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  getQuery(resolve(__dirname, './queries/get_dataset_history.sql'))
    .concatMap((sql) => query(sql, [uuid]))
    .map((row) => toCamelCase(row))
    .toArray()
    .subscribe(
      (results) => res.json({ result: results }),
      (error) => {
        logger.error('Unable to get raw metadata: ', error);
        res.status(500).json({ message: error.message });
      }
    );
}
