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
      host: get('elasticsearch.aws.host').toString(),
      connectionClass: HttpAmazonESConnector,
      amazonES: {
        region: get('elasticsearch.aws.region').toString(),
        accessKey: get('elasticsearch.aws.accessKey').toString(),
        secretKey: get('elasticsearch.aws.secretKey').toString()
      }
    });
  } else {
    currentClient = new Client({
      host: get('elasticsearch.development.host')
    });
  }

  return currentClient;
}
