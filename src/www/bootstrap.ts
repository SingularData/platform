/// <reference path="../typing/require.d.ts"/>

import 'zone.js';
import 'reflect-metadata';

import 'font-awesome/css/font-awesome.css';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AppModule from './modules/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
