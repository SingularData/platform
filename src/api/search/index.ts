import * as search from './search';

export default function attachSearchAPI(app) {
  app.get('/api/search', search.searchKeywords);
}
