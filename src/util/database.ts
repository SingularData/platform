import pgrx from 'pg-reactive';
import * as config from 'config';
import * as minify from 'pg-minify';
import { readFile } from 'fs';
import { Observable, Observer } from 'rxjs';

let db = null;

/**
 * Get the current database connection.
 * @return {Object} pgp database connection.
 */
export function getDB() {
  return db ? db : initialize();
}

/**
 * Initialize database connection.
 * @return {Object} pgp database connection.
 */
export function initialize() {
  if (db) {
    db.end();
  }

  let env = process.env.NODE_EMV || 'development';

  db = new pgrx(config.get(`database.${env}`));

  return db;
}

/**
 * Read query file.
 * @param  {String}               path    query file path
 * @return {Observable<String>}           query file
 */
export function getQuery(path) {
  // return  readFileRx(path, 'utf-8').map((sql) => minify(sql));
  return Observable.create((observer: Observer<string>) => {
    readFile(path, 'utf-8', (err: Error, data: string) => {
      if (err) {
        observer.error(err);
      } else {
        observer.next(data);
        observer.complete();
      }
    });
  });
}
