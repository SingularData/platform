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
    .map((result) => result.hits.hits.map((hit) => {
      let source: any = hit._source;

      return {
        uuid: hit._id,
        name: source.name,
        description: source.description,
        publisher: source.publisher,
        portalLink: source.portalLink,
        tags: source.tags.slice(0, 5)
      };
    }));
}
