import { Observable } from 'rxjs';
import { resolve } from 'path';
import { getClient } from '../../util/elasticsearch';
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
  let client = getClient();
  let search = client.search({
    index: 'datarea',
    type: 'metadata',
    q: query,
    from: offset,
    size: limit
  });

  return Observable.fromPromise(search)
    .map((result) => result.hits.hits.map((hit) => hit._id))
    .mergeMap((md5List) => {
      return getQuery(resolve(__dirname, './queries/get_dataset_lite.sql'))
        .concatMap((sql) => db.query(sql, [md5List]));
    })
    .map((row) => toCamelCase(row))
    .toArray();
}
