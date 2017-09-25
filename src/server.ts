import * as express from 'express';
import * as config from 'config';
import * as morgan from 'morgan';
import { resolve } from 'path';
import { json } from 'body-parser';

import attachDatasetAPI from './api/dataset/index';
import attachPortalAPI from './api/portal/index';

const app = express();
const port = config.get('port');

app.use(json())
   .use(morgan('dev'))
   .use(express.static('./public/www'));

attachDatasetAPI(app);
attachPortalAPI(app);

app
  .get('/*', (req, res) => {
    res.status(200)
      .set({ 'content-type': 'text/html; charset=utf-8' })
      .sendFile('index.html', {
        root: './public/www'
      });
  })
  .listen(port, () => {
    console.log(`Server is running at port ${port}...`);
  });
