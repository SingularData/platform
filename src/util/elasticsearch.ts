/// <reference path="../typing/aws-sdk.d.ts" />

import { Client } from 'elasticsearch';
import HttpAmazonESConnector = require('http-aws-es');

import { get } from 'config';
import { flatMap, omit } from 'lodash';
import { Observable } from 'rxjs';

/**
 * Search parameters
 */
interface SearchParams {
  /**
   * Text for full-text search
   * @type {String}
   */
  text?: string;

  /**
   * Text for structural search, indexed by field name
   * @type {Object}
   */
  fields?: Object;
}

let currentClient;

/**
 * Get the ElasticSearch client based on the application environment.
 */
export function getClient(): Client {

  if (currentClient) {
    return currentClient;
  }

  if (process.env.NODE_ENV === 'production') {
    let AWS = require('aws-sdk') as any;

    AWS.config.update({
      egion: 'us-east-1',
      credentials: new AWS.Credentials(
        get('elasticsearch.accessKey').toString(),
        get('elasticsearch.secretKey').toString()
      )
    });

    currentClient = new Client({
      hosts: [get('elasticsearch.host').toString()],
      connectionClass: HttpAmazonESConnector
    });
  } else {
    currentClient = new Client({
      host: get('elasticsearch.host')
    });
  }

  return currentClient;
}

/**
 * Analyze search text to retrieve full-text search part and field search part.
 * @param   {string}        text  search text
 * @returns {SearchParams}        search parameters
 */
export function getSearchParams(text: string): SearchParams {

  text = text.trim();

  let params: SearchParams = {};
  let searchKeys = [];
  let searchFields = {};

  let filedName = '';
  let wrapped = false;
  let wordStart = 0;

  for (let i = 0, n = text.length; i < n; i++) {
    if (text[i] === '"') {
      if (wrapped) {
        searchFields[filedName] = text.slice(wordStart, i);
        wrapped = false;
        filedName = '';

        // jump to the next space
        wordStart = i + 2;
        i++;
      } else if (text[i - 1] === ':') {
        wrapped = true;
        wordStart = i + 1;
      }
    } else if (text[i] === ':') {
      filedName = text.slice(wordStart, i);
      wordStart = i + 1;
    } else if (text[i] === ' ') {
      if (filedName && !wrapped) {
        searchFields[filedName] = text.slice(wordStart, i);
        wordStart = i + 1;
        filedName = '';
        wrapped = false;
      } else if (!filedName && !wrapped) {
        searchKeys.push(text.slice(wordStart, i));
        wordStart = i + 1;
      }
    }
  }

  if (filedName) {
    searchFields[filedName] = text.slice(wordStart);
  } else  {
    searchKeys.push(text.slice(wordStart));
  }

  if (searchKeys.length > 0) {
    params.text = searchKeys.join(' ');
  }

  if (Object.keys(searchFields).length > 0) {
    params.fields = searchFields;
  }

  return params;
}

/**
 * Get the search field weight.
 * @param   {string} field field name
 * @returns {number}       search weight
 */
export function getFieldWeight(field: string): number {
  switch (field) {
    case 'name':
      return 4;
    case 'tags':
    case 'categories':
      return 3;
    case 'description':
      return 2;
    default:
      return 1;
  }
}
