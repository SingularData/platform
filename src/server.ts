import * as express from 'express';
import * as config from 'config';
import { getLogger } from 'log4js';
import { json } from 'body-parser';

import attachSearchAPI from './api/search/index';

const logger = getLogger('app');
const app = express();

app.use(json());

attachSearchAPI(app);

app.listen(config.get('port'));

logger.info('Server is running...');
