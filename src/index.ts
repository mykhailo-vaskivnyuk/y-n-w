import config = require('./config');
import App from './app/app';
import Logger from './logger/logger';
import DbConnection from './db/connection/pg';
import Router from './router/router';
import InputConnection from './server/http';

// import path from'node:path';
// import custoRequire from './utils/custom.require';
// import customRequire = require('./utils/custom.require');

// const moduleExport = customRequire(path.resolve(__dirname, './utils/test.module.js'));
// console.log('export', moduleExport)
// const arr = new Array(1)
// arr.myMethod()

new App(config)
  .setLogger(Logger)
  .setDatabase(DbConnection)
  .setRouter(Router)
  .setInputConnection(InputConnection)
  .start();

// TODO
// Modules => require
