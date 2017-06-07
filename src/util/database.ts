import pgrx from 'pg-reactive';
import * as config from 'config';
import * as minify from 'pg-minify';
import { camelCase } from 'lodash';
import { readFile } from 'fs';
import { Observable, Observer } from 'rxjs';

let db = null;

/**
 * Get the current database connection.
 * @return {Object} pgp database connection.
 */
export function getDB() {
  return db || initialize();
}

/**
 * Initialize database connection.
 * @return {Object} pgp database connection.
 */
export function initialize() {
  if (db) {
    db.end();
  }

  db = new pgrx(config.get('database.url').toString());

  return db;
}

/**
 * Read query file.
 * @param  {String}               path    query file path
 * @return {Observable.<String>}          query file
 */
export function getQuery(path) {
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

/**
 * Recursively convert the key name from snake case to camel case.
 * @param   {Object} object any object or array
 * @returns {Object}        object or array with camel case keys
 */
export function toCamelCase(object: Object): Object {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) {
      continue;
    }

    if (typeof object[key] === 'object') {
      toCamelCase(object[key]);
    }

    if (key.indexOf('_') !== -1) {
      object[camelCase(key)] = object[key];
      delete object[key];
    }
  }

  return object;
}
