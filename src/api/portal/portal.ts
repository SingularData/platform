import { Observable } from 'rxjs';
import { resolve } from 'path';
import { Readable } from 'stream';
import { noop } from 'lodash';
import { getDB, getQueryFile, toCamelCase } from '../../util/database';
import * as QueryStream from 'pg-query-stream';
import * as stringify from 'csv-stringify';
import * as JSONStream from 'JSONStream';

const legacyDate = new Date(2017, 4, 31);

export function getPortals(req, res) {
  let db = getDB();
  let sql = `
    SELECT * FROM public.mview_portal AS vp
    ORDER BY vp.platform, vp.name, vp.region
  `;

  db.any(sql)
    .then((results) => res.json({ result: toCamelCase(results) }))
    .catch((error) => {
      console.error('Unable to search: ', error);
      res.status(500).json({ message: error.message });
    });
}

export function getPortalStats(req, res) {
  let date = req.query.date ? new Date(req.query.date) : new Date();
  let format = req.query.format ? req.query.format : 'json';

  let db = getDB();
  let filePath = date < legacyDate ? 'queries/get_legacy_stats.sql' : 'queries/get_stats.sql';
  let queryFile = getQueryFile(resolve(__dirname, filePath));
  let qs = new QueryStream(queryFile.query, [date]);

  db.stream(qs, (s) => {
    if (format === 'json') {
      res.setHeader('Content-disposition', 'attachment; filename=data.json');
      res.set('Content-Type', 'application/json');
      s.pipe(JSONStream.stringify()).pipe(res);
    } else {
      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');
      s.pipe(JSONStream.stringify()).pipe(res);
    }
  })
  .catch((error) => {
    console.error('Unable to retrieve portal statistics: ', error);
    res.status(500).json({ message: error.message });
  });
}
