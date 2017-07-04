import { Observable } from 'rxjs';
import { resolve } from 'path';
import { getClient, getSearchParams, getFieldWeight } from '../../util/elasticsearch';
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
  let params = getSearchParams(query);
  let fields = ['_all'];

  if (params.fields) {
    for (let name in params.fields) {
      fields.push(`${name}^${getFieldWeight(name)}`);
    }
  }

  let search = client.search({
    index: 'datarea',
    type: 'metadata',
    from: offset,
    size: limit,
    body: {
      query: {
        query_string: {
          fields,
          query
        }
      }
    }
  });

  return Observable.fromPromise(search)
    .map((result) => result.hits.hits.map((hit) => {
      let source: any = hit._source;

      return {
        uuid: hit._id,
        name: source.name,
        description: source.description,
        publisher: source.publisher,
        url: source.url,
        tags: source.tags ? source.tags.slice(0, 5) : []
      };
    }));
}
