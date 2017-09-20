import { getLogger } from 'log4js';
import { resolve } from 'path';
import { isNaN } from 'lodash';
import { get } from 'config';
import { Observable } from 'rxjs';
import { search } from './es-search';
import { getDB, getQueryFile, toCamelCase } from '../../util/database';
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

  let db = getDB();
  let getDataQuery, task;

  if (req.query.version) {
    getDataQuery = getQueryFile(resolve(__dirname, './queries/get_dataset_version.sql'));
    task = db.oneOrNone(getDataQuery, [uuid, +req.query.version]);
  } else {
    getDataQuery = getQueryFile(resolve(__dirname, './queries/get_dataset_latest.sql'));
    task = db.oneOrNone(getDataQuery, [uuid]);
  }

  task
    .then((dataset) => {
      if (!dataset) {
        return res.status(400).json({
          message: 'Unable to find dataset with the input ID.'
        });
      }

      res.json({ result: toCamelCase(dataset) });
    })
    .catch((error) => {
      logger.error('Unable to get dataset details: ', error);
      res.status(500).json({ message: error.message });
    });
}

export function getDatasetRaw(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  let db = getDB();
  let dataQuery, task;

  if (req.query.version) {
    dataQuery = getQueryFile(resolve(__dirname, './queries/get_dataset_raw_version.sql'));
    task = db.oneOrNone(dataQuery,  [uuid, +req.query.version]);
  } else {
    dataQuery = getQueryFile(resolve(__dirname, './queries/get_dataset_raw_latest.sql'));
    task = db.oneOrNone(dataQuery,  [uuid]);
  }

  task
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: 'Unable to find dataset with the input ID.' });
      }

      res.json({ result: result.raw });
    })
    .catch((error) => {
      logger.error('Unable to get raw metadata: ', error);
      res.status(500).json({ message: error.message });
    });
}

export function getDatasetHistory(req, res) {
  let uuid = req.params.uuid;

  if (!uuid) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  let db = getDB();
  let queryFile = getQueryFile(resolve(__dirname, './queries/get_dataset_history.sql'));

  db.any(queryFile, [uuid])
    .then((results) => res.json({ result: results })
    .catch((error) => {
      logger.error('Unable to get raw metadata: ', error);
      res.status(500).json({ message: error.message });
    }));
}
