/// <reference path="../typing/http-aws-es.d.ts"/>

import { Client } from 'elasticsearch';
import HttpAmazonESConnector = require('http-aws-es');

import { get } from 'config';
import { flatMap, omit } from 'lodash';
import { Observable } from 'rxjs';


let currentClient;

/**
 * Get the ElasticSearch client based on the application environment.
 */
export function getClient(): Client {

  if (currentClient) {
    return currentClient;
  }

  if (process.env.NODE_ENV === 'production') {
    currentClient = new Client({
      host: get('elasticsearch.host').toString(),
      connectionClass: HttpAmazonESConnector,
      amazonES: {
        region: get('elasticsearch.region').toString(),
        accessKey: get('elasticsearch.accessKey').toString(),
        secretKey: get('elasticsearch.secretKey').toString()
      }
    });
  } else {
    currentClient = new Client({
      host: get('elasticsearch.host')
    });
  }

  return currentClient;
}
