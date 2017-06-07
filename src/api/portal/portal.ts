import { Observable } from 'rxjs';
import { resolve } from 'path';
import { Readable } from 'stream';
import { getLogger } from 'log4js';
import { noop } from 'lodash';
import { getDB, getQuery, toCamelCase } from '../../util/database';

const logger = getLogger('portal');
const legacyDate = new Date(2017, 4, 31);

export function getPortals(req, res) {
  let db = getDB();
  let query = `
    SELECT * FROM public.mview_portal AS vp
    WHERE vp.dataset_count IS NOT NULL
    ORDER BY vp.platform, vp.name, vp.region
  `;

  db.query(query)
    .map((portal) => toCamelCase(portal))
    .toArray()
    .subscribe((portals) => {
      res.json({
        success: true,
        portals: portals
      });
    }, (error) => {
      logger.error('Unable to search: ', error);
      res.json({
        success: false,
        message: error.message
      });
    });
}

export function getPortalStats(req, res) {
  let date = req.query.date ? new Date(req.query.date) : new Date();
  let format = req.query.format ? req.query.format : 'json';
  let stream;

  let sqlFile = date < legacyDate ? 'queries/get_legacy_stats.sql' : 'queries/get_stats.sql';
  let observable = getQuery(resolve(__dirname, sqlFile))
    .concatMap((sql) => getDB().query(sql, [date]))
    .map((row) => toCamelCase(row));

  if (format === 'json') {
    res.setHeader('Content-disposition', 'attachment; filename=data.json');
    res.set('Content-Type', 'application/json');
    stream = toJSONStream(observable);
  } else {
    res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    stream = toCSVStream(observable);
  }

  stream.pipe(res);
}

function toCSVStream(observable: Observable<any>) {
  let stream = new Readable();
  stream._read = noop;
  stream.push('name,url,description,platform,dataset count,tag count,category count,publisher count\n');

  observable.subscribe((row) => {
    let datasetCount = row.datasetCount || '';
    let tagCount = row.tags ? row.tags.length : '';
    let catCount = row.categories ? row.categories.length : '';
    let pubCount = row.publishers ? row.publishers.length : '';

    stream.push(`"${row.name}",${row.url},"${row.description || ''}",${row.platform || ''},${datasetCount},${tagCount},${catCount},${pubCount}\n`);
  }, (error) => {
    stream.emit('error', error);
  }, () => {
    stream.push(null);
  });

  return stream;
}

function toJSONStream(observable: Observable<any>) {
  let firstRow = true;
  let stream = new Readable();
  stream._read = noop;
  stream.push('[');

  observable.subscribe((row) => {
    let data = JSON.stringify(row);

    if (firstRow) {
      firstRow = false;
    } else {
      data = ',' + data;
    }

    stream.push(data);
  }, (error) => {
    stream.emit('error', error);
  }, () => {
    stream.push(']');
    stream.push(null);
  });

  return stream;
}
