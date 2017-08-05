import { QueryFile } from 'pg-promise';
import * as pgPromise from 'pg-promise';
import * as config from 'config';
import { camelCase } from 'lodash';
var pgp = pgPromise();
var queryCache = {};
var db = null;
export function getDB() {
    return db || initialize();
}
export function initialize() {
    if (db) {
        db.end();
    }
    db = pgp(config.get('database.url').toString());
    return db;
}
export function getQueryFile(path) {
    if (!queryCache[path]) {
        queryCache[path] = new QueryFile(path, { minify: true });
    }
    return queryCache[path];
}
export function toCamelCase(object) {
    for (var key in object) {
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
//# sourceMappingURL=database.js.map