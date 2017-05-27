import { Observable } from 'rxjs';
import { resolve } from 'path';
import { getDB, getQuery, toCamelCase } from '../../util/database';

/**
 * Search dataset with PostgreSQL full-text search
 * @param   {string}     query  query string
 * @param   {number}     offset result offset
 * @param   {number}     limit  result size
 * @returns {Observable}        an observable containing an array of results
 */
export function search(query: string, offset: number, limit: number): Observable<Array<any>> {
  let db = getDB();

  return getQuery(resolve(__dirname, './queries/search_datasets.sql'))
    .concatMap((sql) => db.query(sql, [query, offset, limit + 1]))
    .toArray();
}
