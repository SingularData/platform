import { expect } from 'chai';
import { getQuery, toCamelCase } from '../../src/util/database';

describe('ConversionService', () => {

  it('toCamelCase() should convert snake case keys to camel case keys.', () => {
    let object: Object = {
      'userId': 1,
      'user_name': 'Tom'
    };

    toCamelCase(object);

    expect(object).to.deep.equal({
      userId: 1,
      userName: 'Tom'
    });
  });

  it('toCamelCase() should work with an array of objects.', () => {
    let array = [
      { userId: 1 },
      { 'user_id': 2 }
    ];

    toCamelCase(array);

    expect(array).to.deep.equal([
      { userId: 1 },
      { userId: 2 }
    ]);
  });

  it('getQuery() should read a SQL file and return the query.', (done) => {
    getQuery('./queries/test.sql')
      .subscribe(
        (sql) => {
          expect(sql).to.equal('SELECT 1');
          done();
        },
        () => done(),
        () => done()
      );
  });

});
