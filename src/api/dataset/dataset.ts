import { resolve } from 'path';
import { get } from 'config';
import { Observable } from 'rxjs';
import { search } from './es-search';
import { getDB, getQueryFile, toCamelCase } from '../../util/database';
import { Dataset } from '@singular-data/dataset-spec';
import * as _ from 'lodash';

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
      console.error('Unable to search: ', error);
      res.status(500).json({ message: error.message });
    }, () => {
      res.json({
        results: datasets.slice(0, limit),
        nextPage: datasets.length > limit
      });
    });
}

export function getDataset(req, res) {
  let identifier = req.params.identifier;
  let latest = _.toLower(req.query.latest) === 'true';

  if (!identifier) {
    res.status(400).json({ message: 'Invalid dataset identifier.' });
    return;
  }

  let db = getDB();
  let query;

  if (latest) {
    query = getQueryFile(resolve(__dirname, './queries/get_dataset_latest.sql'));
  } else {
    query = getQueryFile(resolve(__dirname, './queries/get_dataset.sql'));
  }

  db.oneOrNone(query, [identifier])
    .then((dataset) => {
      if (!dataset) {
        return res.status(400).json({
          message: 'Unable to find dataset with the given identifier.'
        });
      }

      res.json({ result: toCamelCase(dataset) });
    })
    .catch((error) => {
      console.error('Unable to get dataset details: ', error);
      res.status(500).json({ message: error.message });
    });
}

export function getDatasetRaw(req, res) {
  let identifier = req.params.identifier;

  if (!identifier) {
    res.status(400).json({ message: 'Invalid dataset UUID.' });
    return;
  }

  let db = getDB();
  let query = getQueryFile(resolve(__dirname, './queries/get_dataset_raw.sql'));

  db.oneOrNone(query,  [identifier])
    .then((result) => {
      if (!result) {
        return res.status(400).json({ message: 'Unable to find dataset with the given identifier.' });
      }

      res.json({ result: result.raw });
    })
    .catch((error) => {
      console.error('Unable to get raw metadata: ', error);
      res.status(500).json({ message: error.message });
    });
}

export function getDatasetHistory(req, res) {
  let portal = req.body.portal;
  let title = req.body.title;

  if (!title || !portal) {
    res.status(400).json({ message: 'Invalid portal and dataset title.' });
    return;
  }

  let db = getDB();
  let query = getQueryFile(resolve(__dirname, './queries/get_dataset_history.sql'));

  db.any(query, [title, portal])
    .then((results) => res.json({ result: results })
    .catch((error) => {
      console.error('Unable to get raw metadata: ', error);
      res.status(500).json({ message: error.message });
    }));
}
