// source: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/16743

/// <reference types="node" />

import * as e from 'elasticsearch';
import { Credentials } from 'aws-sdk/lib/core';

declare module 'elasticsearch' {
  export interface AmazonESOptions {
    accessKey?: string;
    credentials?: Credentials;
    region: string;
    secretKey?: string;
  }

  export interface ConfigOptions {
    amazonES?: AmazonESOptions;
  }
}

declare const HttpAmazonESConnector: any;
export = HttpAmazonESConnector;
