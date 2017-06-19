/// <reference path="../typing/require.d.ts"/>

import 'zone.js';
import 'reflect-metadata';
import './polyfill/leaflet.poly';

import '@angular/material/prebuilt-themes/indigo-pink.css';
import 'font-awesome/css/font-awesome.css';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import AppModule from './modules/app.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);
