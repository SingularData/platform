import { expect } from 'chai';
import { toCamelCase } from '../../src/util/database';

describe('util/database.toCamelCase()', () => {

  it('should convert snake case keys to camel case keys.', () => {
    let object: Object = {
      userId: 1,
      user_name: 'Tom'
    };

    toCamelCase(object);

    expect(object).to.deep.equal({
      userId: 1,
      userName: 'Tom'
    });
  });

  it('should work with an array of objects.', () => {
    let array = [
      { userId: 1 },
      { user_id: 2 }
    ];

    toCamelCase(array);

    expect(array).to.deep.equal([
      { userId: 1 },
      { userId: 2 }
    ]);
  });

});
