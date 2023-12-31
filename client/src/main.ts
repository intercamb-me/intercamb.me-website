import '@assets/img/favicon.ico';
import '@assets/img/og-image.jpg';
import '@assets/img/landing-background.jpg';
import '@assets/img/calendar.png';
import '@assets/img/clients.png';
import '@assets/img/documents.png';
import '@assets/img/payments.png';
import '@assets/img/reports.png';
import '@assets/img/tasks.png';

import '@assets/styles/styles.less';
import 'bootstrap/dist/css/bootstrap.css';
import 'angular-calendar/css/angular-calendar.css';

import 'core-js/es6/array';
import 'core-js/es6/date';
import 'core-js/es6/function';
import 'core-js/es6/map';
import 'core-js/es6/math';
import 'core-js/es6/number';
import 'core-js/es6/object';
import 'core-js/es6/parse-float';
import 'core-js/es6/parse-int';
import 'core-js/es6/reflect';
import 'core-js/es6/regexp';
import 'core-js/es6/set';
import 'core-js/es6/string';
import 'core-js/es6/symbol';
import 'core-js/es6/weak-map';
import 'core-js/es6/weak-set';
import 'core-js/es7/reflect';

import 'zone.js/dist/zone';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from '@app/app.module';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
} else {
  Error.stackTraceLimit = Infinity;
  // tslint:disable-next-line: no-var-requires
  require('zone.js/dist/long-stack-trace-zone');
}

platformBrowserDynamic().bootstrapModule(AppModule);
