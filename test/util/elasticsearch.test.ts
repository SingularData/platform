import { expect } from 'chai';
import { getSearchParams } from '../../src/util/elasticsearch';

describe('util/elasticsearch.getSearchParams()', () => {

  it('should retrieve text for full-text search.', () => {
    let text = 'my text search';
    let params = getSearchParams(text);

    expect(params.text).to.equal(text);
    expect(params.fields).to.be.undefined;
  });

  it('should retrieve fields for structural search.', () => {
    let text = 'created:2017-02-03 platform:CKAN';
    let params = getSearchParams(text);

    expect(params.text).to.be.undefined;
    expect(params.fields).to.deep.equal({
      created: '2017-02-03',
      platform: 'CKAN'
    });
  });

  it('should retrieve both fields and text for search', () => {
    let text = 'my created:2017-02-03 platform:CKAN text search';
    let params = getSearchParams(text);

    expect(params.text).to.equal('my text search');
    expect(params.fields).to.deep.equal({
      created: '2017-02-03',
      platform: 'CKAN'
    });
  });

  it('should regonize wrapped field value.', () => {
    let text = 'platform:"ArcGIS Open Data" my text search';
    let params = getSearchParams(text);

    expect(params.text).to.equal('my text search');
    expect(params.fields).to.deep.equal({
      platform: 'ArcGIS Open Data'
    });
  });

  it('should handle unclosed text wrap.', () => {
    let text = ' my text search platform:"ArcGIS Open Data';
    let params = getSearchParams(text);

    expect(params.text).to.equal('my text search');
    expect(params.fields).to.deep.equal({
      platform: 'ArcGIS Open Data'
    });
  });
});
